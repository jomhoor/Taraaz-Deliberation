/**
 * SSO (Single Sign-On) authentication service for Jomhoor SSO integration.
 *
 * One-step OAuth2 PKCE auth-code flow:
 *
 *   Browser generates PKCE pair → Redirects to sso-svc → sso-svc redirects back
 *   with ?code=... → Frontend calls this backend with code + code_verifier →
 *   Backend exchanges code at sso-svc for JWT → Decodes JWT sub (pairwise subject) →
 *   Creates/links ssoAccount row → Completes register/login/merge → Returns userId.
 *
 * Security model:
 * - PKCE S256: code_verifier validated by sso-svc at exchange time
 * - Pairwise subject: sso-svc returns a stable, RP-specific sub per user
 * - One-time code: sso-svc invalidates code after successful exchange
 * - UCAN: The caller's didWrite is already authenticated by the route middleware
 */

import { log } from "@/app.js";
import { generateUUID } from "@/crypto.js";
import { generateUnusedRandomUsername } from "@/service/account.js";
import { determineAuthType } from "@/service/auth/core/stateHelpers.js";
import type { AuthResult, CredentialAuthState } from "@/service/auth/core/types.js";
import * as authUtilService from "@/service/authUtil.js";
import { mergeGuestIntoVerifiedUser } from "@/service/merge.js";
import {
    deviceTable,
    ssoAccountTable,
    ssoDesktopSessionTable,
    userTable,
} from "@/shared-backend/schema.js";
import type {
    SsoDesktopInitiate200,
    SsoDesktopMobileComplete200,
    SsoDesktopPoll200,
    SsoExchange200,
} from "@/shared/types/dto.js";
import { nowZeroMs } from "@/shared/util.js";
import axios from "axios";
import { and, desc, eq } from "drizzle-orm";
import { type PostgresJsDatabase as PostgresDatabase } from "drizzle-orm/postgres-js";
import { createHash, randomBytes } from "node:crypto";

// ─── SSO code exchange ─────────────────────────────────────────────────────────

interface ExchangeSsoCodeProps {
    db: PostgresDatabase;
    didWrite: string;
    code: string;
    codeVerifier: string;
    userAgent: string;
    ssoUrl: string;
    ssoClientSecret: string;
    sessionLifetimeDays: number;
}

interface SsoTokenResponse {
    access_token: string;
    refresh_token?: string;
}

/**
 * Parse a JWT payload without verifying the signature.
 * The token was just issued by sso-svc (our trusted service) over HTTPS —
 * signature verification would require fetching the public key and is
 * unnecessary for this server-to-server trust boundary.
 */
function parseJwtSub(token: string): string | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
        return typeof payload.sub === "string" ? payload.sub : null;
    } catch {
        return null;
    }
}

/**
 * Get the SSO authentication state for a given (ssoSubject, clientId) pair.
 * Maps to the generic CredentialAuthState used by determineAuthType().
 */
async function getSsoAuthState({
    db,
    ssoSubject,
    clientId,
    didWrite,
}: {
    db: PostgresDatabase;
    ssoSubject: string;
    clientId: string;
    didWrite: string;
}): Promise<CredentialAuthState> {
    // Query 1: Check device association — is this device already linked to this SSO subject?
    const deviceAssocResult = await db
        .select({ ssoAccountId: ssoAccountTable.id })
        .from(deviceTable)
        .leftJoin(
            ssoAccountTable,
            and(
                eq(ssoAccountTable.userId, deviceTable.userId),
                eq(ssoAccountTable.ssoSubject, ssoSubject),
                eq(ssoAccountTable.clientId, clientId),
                eq(ssoAccountTable.isDeleted, false),
            ),
        )
        .where(eq(deviceTable.didWrite, didWrite));

    const deviceExists = deviceAssocResult.length > 0;
    const isAssociated = deviceExists && deviceAssocResult[0].ssoAccountId !== null;

    // Query 2: Does any active user own this SSO subject?
    const ssoOwnerResult = await db
        .select({ userId: ssoAccountTable.userId, isDeleted: userTable.isDeleted })
        .from(ssoAccountTable)
        .innerJoin(userTable, eq(userTable.id, ssoAccountTable.userId))
        .where(
            and(
                eq(ssoAccountTable.ssoSubject, ssoSubject),
                eq(ssoAccountTable.clientId, clientId),
                eq(ssoAccountTable.isDeleted, false),
            ),
        );

    const activeOwner = ssoOwnerResult.find((r) => !r.isDeleted);

    if (isAssociated && activeOwner) {
        return {
            deviceCredentialAssociation: "device_owns_credential",
            userId: activeOwner.userId,
        };
    }

    if (activeOwner) {
        // SSO subject is already linked to a different user
        return deviceExists
            ? {
                  deviceCredentialAssociation: "device_missing_credential_owned",
                  userId: activeOwner.userId,
                  isRegistered: true, // SSO is a hard credential
              }
            : {
                  deviceCredentialAssociation: "device_unknown_credential_owned",
                  userId: activeOwner.userId,
                  isRegistered: true,
              };
    }

    // SSO subject is free — new registration
    return deviceExists
        ? { deviceCredentialAssociation: "device_missing_credential_available" }
        : { deviceCredentialAssociation: "device_unknown_credential_available" };
}

/**
 * Exchange an OAuth2 authorization code for a session on Taraaz.
 *
 * 1. POST code + code_verifier to sso-svc /v1/tokens/exchange
 * 2. Decode JWT `sub` (pairwise subject for "taraaz" client)
 * 3. Determine auth type (register / login_known / login_new / merge)
 * 4. Create/update ssoAccountTable + deviceTable inside a transaction
 * 5. Return { success, userId, accountMerged }
 */
export async function exchangeSsoCode({
    db,
    didWrite,
    code,
    codeVerifier,
    userAgent,
    ssoUrl,
    ssoClientSecret,
    sessionLifetimeDays,
}: ExchangeSsoCodeProps): Promise<SsoExchange200> {
    const CLIENT_ID = "taraaz";
    const now = nowZeroMs();

    // ── 1. Exchange code at sso-svc ─────────────────────────────────────────
    let ssoSub: string;
    try {
        const resp = await axios.post<SsoTokenResponse>(
            `${ssoUrl}/v1/tokens/exchange`,
            {
                code,
                client_id: CLIENT_ID,
                client_secret: ssoClientSecret,
                code_verifier: codeVerifier,
            },
            { timeout: 10_000 },
        );

        const sub = parseJwtSub(resp.data.access_token);
        if (!sub) {
            log.warn("[SSO] Exchange returned token with missing/invalid sub");
            return { success: false, reason: "sso_error" };
        }
        ssoSub = sub;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            log.warn(
                { status: err.response?.status, data: err.response?.data },
                "[SSO] Code exchange failed",
            );
            const status = err.response?.status;
            if (status === 400 || status === 401 || status === 422) {
                return { success: false, reason: "invalid_code" };
            }
        } else {
            log.error({ err }, "[SSO] Unexpected error during code exchange");
        }
        return { success: false, reason: "sso_error" };
    }

    log.info({ ssoSub }, "[SSO] Code exchanged successfully");

    // ── 2. Determine auth type ───────────────────────────────────────────────
    const deviceStatus = await authUtilService.getDeviceStatus({ db, didWrite, now });

    const credentialAuthState = await getSsoAuthState({
        db,
        ssoSubject: ssoSub,
        clientId: CLIENT_ID,
        didWrite,
    });

    const authResult: AuthResult = determineAuthType({
        credentialAuthState,
        deviceStatus,
        authMethod: "sso",
    });

    if (authResult.type === "associated_with_another_user") {
        log.warn({ ssoSub }, "[SSO] Subject associated with a different user — rejecting");
        return { success: false, reason: "associated_with_another_user" };
    }

    // ── 3. Compute session expiry ────────────────────────────────────────────
    const sessionExpiry = new Date(now);
    sessionExpiry.setDate(sessionExpiry.getDate() + sessionLifetimeDays);

    let accountMerged = false;

    // ── 4. Apply auth action in a transaction ────────────────────────────────
    await db.transaction(async (tx) => {
        switch (authResult.type) {
            case "register": {
                // Create user + device + sso_account
                await tx.insert(userTable).values({
                    id: authResult.userId,
                    username: await generateUnusedRandomUsername({ db }),
                });
                await tx.insert(deviceTable).values({
                    didWrite,
                    userId: authResult.userId,
                    userAgent,
                    sessionExpiry,
                });
                // Soft-delete any stale sso_account whose owner user was deleted
                // but whose sso_account row was not cleaned up. getSsoAuthState
                // uses innerJoin(userTable) and filters out soft-deleted users via
                // .find(r => !r.isDeleted), so it returns null for activeOwner and
                // falls through to "register" — which then hits a unique-constraint
                // violation. Cleaning up here is safe: the only way determineAuthType
                // returns "register" is when getSsoAuthState found no active owner,
                // meaning any existing sso_account is guaranteed to belong to a
                // deleted user.
                await tx
                    .update(ssoAccountTable)
                    .set({ isDeleted: true })
                    .where(
                        and(
                            eq(ssoAccountTable.ssoSubject, ssoSub),
                            eq(ssoAccountTable.clientId, CLIENT_ID),
                            eq(ssoAccountTable.isDeleted, false),
                        ),
                    );
                await tx.insert(ssoAccountTable).values({
                    userId: authResult.userId,
                    ssoSubject: ssoSub,
                    clientId: CLIENT_ID,
                });
                log.info({ userId: authResult.userId, ssoSub }, "[SSO] Registered new user");
                break;
            }
            case "login_known_device": {
                // Refresh session expiry
                await tx
                    .update(deviceTable)
                    .set({ sessionExpiry, updatedAt: now })
                    .where(eq(deviceTable.didWrite, didWrite));
                log.info({ userId: authResult.userId, ssoSub }, "[SSO] Known device login");
                break;
            }
            case "login_new_device": {
                // Add device to existing user account; sso_account row already exists
                await tx.insert(deviceTable).values({
                    didWrite,
                    userId: authResult.userId,
                    userAgent,
                    sessionExpiry,
                });
                log.info({ userId: authResult.userId, ssoSub }, "[SSO] New device login");
                break;
            }
            case "merge": {
                // Merge guest account (device user) into the verified SSO account owner
                await mergeGuestIntoVerifiedUser({
                    db: tx,
                    verifiedUserId: authResult.toUserId,
                    guestUserId: authResult.fromUserId,
                });
                await tx
                    .update(deviceTable)
                    .set({ userId: authResult.toUserId, sessionExpiry, updatedAt: now })
                    .where(eq(deviceTable.didWrite, didWrite));
                log.info(
                    { toUserId: authResult.toUserId, fromUserId: authResult.fromUserId, ssoSub },
                    "[SSO] Merged guest into verified user",
                );
                accountMerged = true;
                break;
            }
        }
    });

    const userId =
        authResult.type === "merge" ? authResult.toUserId : authResult.userId;

    log.info({ userId, ssoSub, accountMerged }, "[SSO] Authentication completed");

    return { success: true, userId, accountMerged };
}

// ─── Desktop SSO QR flow ───────────────────────────────────────────────────────

const SSO_DESKTOP_SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SSO_CLIENT_ID = "taraaz";

/**
 * Initiate a desktop SSO session for the QR-code cross-device flow.
 *
 * 1. Generate PKCE (code_verifier, code_challenge) server-side so the verifier
 *    is stored securely on the backend rather than in the desktop's localStorage.
 * 2. Call sso-svc GET /v1/authorize without following the 302 redirect to obtain
 *    the challenge nonce from the Location header.
 * 3. Persist the session row (TTL = 5 min).
 * 4. Return the deep link for the QR code:
 *    jomhoor://auth/sso?challenge=<nonce>&client_id=taraaz&state=<state>&desktop_session_id=<id>
 *    The wallet will parse desktop_session_id and, after approval, POST the code
 *    back to /api/v1/auth/sso/desktop/mobile-complete instead of opening the
 *    redirect URL in the system browser.
 */
export async function initiateSsoDesktopSession({
    db,
    didWrite,
    ssoUrl,
    ssoClientSecret: _ssoClientSecret,
    redirectUri,
}: {
    db: PostgresDatabase;
    didWrite: string;
    ssoUrl: string;
    ssoClientSecret: string;
    redirectUri: string;
}): Promise<SsoDesktopInitiate200> {
    // Generate PKCE server-side
    const codeVerifierBytes = randomBytes(32);
    const codeVerifier = codeVerifierBytes.toString("base64url");
    const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
    const state = generateUUID();

    const params = new URLSearchParams({
        client_id: SSO_CLIENT_ID,
        redirect_uri: redirectUri,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });

    let ssoLocation: string;
    try {
        const resp = await axios.get(`${ssoUrl}/v1/authorize?${params.toString()}`, {
            maxRedirects: 0,
            validateStatus: (s) => s >= 200 && s < 400,
        });
        const location = resp.headers["location"] as string | undefined;
        if (!location) {
            log.warn("[SSO Desktop] sso-svc did not return a Location header");
            return { success: false, reason: "sso_error" };
        }
        ssoLocation = location;
    } catch (err) {
        log.error({ err }, "[SSO Desktop] Failed to call sso-svc /v1/authorize");
        return { success: false, reason: "sso_error" };
    }

    // Store session
    const sessionId = generateUUID();
    const now = nowZeroMs();
    const expiresAt = new Date(now.getTime() + SSO_DESKTOP_SESSION_TTL_MS);

    await db.insert(ssoDesktopSessionTable).values({
        id: sessionId,
        codeVerifier,
        state,
        desktopDidWrite: didWrite,
        status: "pending",
        expiresAt,
        createdAt: now,
        updatedAt: now,
    });

    // Append desktop_session_id to the deep link so the wallet knows to POST
    // the code back here instead of opening redirect_url in the system browser.
    const separator = ssoLocation.includes("?") ? "&" : "?";
    const deepLink = `${ssoLocation}${separator}desktop_session_id=${encodeURIComponent(sessionId)}`;

    log.info({ sessionId, didWrite }, "[SSO Desktop] Session initiated");
    return { success: true, sessionId, deepLink };
}

/**
 * Complete a desktop SSO session from the mobile wallet.
 *
 * Called by the wallet (no UCAN) after the user approves the SSO consent screen.
 * The wallet extracts the OAuth2 code from the redirect_url it received and POSTs
 * it here along with the desktop_session_id from the original deep link.
 *
 * SECURITY: The session_id is a 128-bit UUID. The code is a one-time token issued
 * by sso-svc — it is useless without the code_verifier (PKCE), which only this
 * backend holds. An attacker who intercepts the deep link still cannot complete the
 * flow without the session_id.
 */
export async function completeSsoDesktopSessionFromMobile({
    db,
    sessionId,
    code,
    userAgent,
    ssoUrl,
    ssoClientSecret,
    sessionLifetimeDays,
}: {
    db: PostgresDatabase;
    sessionId: string;
    code: string;
    userAgent: string;
    ssoUrl: string;
    ssoClientSecret: string;
    sessionLifetimeDays: number;
}): Promise<SsoDesktopMobileComplete200> {
    const now = nowZeroMs();

    const sessions = await db
        .select()
        .from(ssoDesktopSessionTable)
        .where(eq(ssoDesktopSessionTable.id, sessionId));

    const session = sessions[0];
    if (!session) {
        log.warn({ sessionId }, "[SSO Desktop] Session not found");
        return { success: false, reason: "invalid_session" };
    }
    if (session.status !== "pending") {
        log.warn({ sessionId, status: session.status }, "[SSO Desktop] Session already used");
        return { success: false, reason: "already_used" };
    }
    if (session.expiresAt < now) {
        log.warn({ sessionId }, "[SSO Desktop] Session expired");
        return { success: false, reason: "expired" };
    }

    // Exchange the code using the server-stored code_verifier
    const exchangeResult = await exchangeSsoCode({
        db,
        didWrite: session.desktopDidWrite,
        code,
        codeVerifier: session.codeVerifier,
        userAgent,
        ssoUrl,
        ssoClientSecret,
        sessionLifetimeDays,
    });

    const newStatus = exchangeResult.success ? "complete" : "failed";
    await db
        .update(ssoDesktopSessionTable)
        .set({ status: newStatus, updatedAt: now })
        .where(eq(ssoDesktopSessionTable.id, sessionId));

    if (!exchangeResult.success) {
        log.warn({ sessionId, reason: exchangeResult.reason }, "[SSO Desktop] Code exchange failed");
        return { success: false, reason: "sso_error" };
    }

    log.info({ sessionId, userId: exchangeResult.userId }, "[SSO Desktop] Session completed");
    return { success: true };
}

/**
 * Poll the status of the desktop SSO session.
 *
 * The desktop frontend calls this every ~2 seconds after showing the QR code.
 * Returns the status of the most recent non-failed session for this device.
 */
export async function pollSsoDesktopSession({
    db,
    didWrite,
}: {
    db: PostgresDatabase;
    didWrite: string;
}): Promise<SsoDesktopPoll200> {
    const now = nowZeroMs();

    const sessions = await db
        .select()
        .from(ssoDesktopSessionTable)
        .where(eq(ssoDesktopSessionTable.desktopDidWrite, didWrite))
        .orderBy(desc(ssoDesktopSessionTable.createdAt))
        .limit(1);

    const session = sessions[0];
    if (!session) {
        return { success: true, status: "no_session" };
    }
    if (session.status === "complete") {
        return { success: true, status: "complete" };
    }
    if (session.expiresAt < now || session.status === "failed") {
        return { success: true, status: "expired" };
    }
    return { success: true, status: "pending" };
}

