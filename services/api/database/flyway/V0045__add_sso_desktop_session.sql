-- Desktop SSO session table for cross-device QR code authentication flow.
-- Flow: desktop initiates → backend stores PKCE + gets challenge from sso-svc →
--       QR shown → wallet scans → wallet POSTs code back → desktop polls and logs in.
CREATE TABLE "sso_desktop_session" (
    "id" text PRIMARY KEY, -- UUID v4 — acts as one-time session token
    "code_verifier" text NOT NULL,
    "state" text NOT NULL,
    "desktop_did_write" text NOT NULL,
    "status" varchar(20) NOT NULL DEFAULT 'pending', -- pending | complete | failed
    "expires_at" timestamp(0) NOT NULL,
    "created_at" timestamp(0) NOT NULL DEFAULT now(),
    "updated_at" timestamp(0) NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "sso_desktop_session_did_write_idx" ON "sso_desktop_session" USING btree ("desktop_did_write");
