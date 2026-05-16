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
import * as authUtilService from "@/service/authUtil.js";
import { determineAuthType } from "@/service/auth/core/stateHelpers.js";
import type { AuthResult, CredentialAuthState } from "@/service/auth/core/types.js";
import { mergeGuestIntoVerifiedUser } from "@/service/merge.js";
import { generateUnusedRandomUsername } from "@/service/account.js";
import {
    deviceTable,
    ssoAccountTable,
    userTable,
} from "@/shared-backend/schema.js";
import type { SsoExchange200 } from "@/shared/types/dto.js";
import { nowZeroMs } from "@/shared/util.js";
import axios from "axios";
import { and, eq } from "drizzle-orm";
import { type PostgresJsDatabase as PostgresDatabase } from "drizzle-orm/postgres-js";

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
