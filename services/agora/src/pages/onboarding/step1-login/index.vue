<template>
  <OnboardingLayout>
    <template #body>
      <ClusterImageExample />
    </template>
    <template #footer>
      <StepperLayout
        :submit-call-back="() => {}"
        :current-step="1"
        :total-steps="5"
        :enable-next-button="true"
        :show-next-button="false"
        :show-loading-button="false"
      >
        <template #header>
          <InfoHeader
            :title="t('pageTitle')"
            :description="t('description')"
            icon-name="mdi-login"
          />
        </template>

        <template #body>
          <!-- Desktop SSO QR mode -->
          <template v-if="ssoQrMode">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
              <p style="text-align: center; font-size: 0.9rem; color: #6b7280;">
                Scan with Jomhoor wallet to sign in
              </p>
              <div v-if="deepLink && qrcode" style="border-radius: 8px; overflow: hidden; background: #fff;">
                <img :src="qrcode" alt="QR code" style="width: 218px; height: 218px; display: block;" />
              </div>
              <div v-else-if="ssoQrError" style="color: #ef4444; text-align: center; font-size: 0.85rem;">
                {{ ssoQrError }}
              </div>
              <div v-else style="width: 218px; height: 218px; display: flex; align-items: center; justify-content: center;">
                <q-spinner size="2rem" />
              </div>
              <ZKGradientButton
                :label="t('cancel')"
                @click="cancelSsoQr()"
              />
            </div>
          </template>

          <!-- Normal login buttons -->
          <template v-else>
            <ZKGradientButton
              :label="t('loginWithPhone')"
              @click="goToPhoneLogin()"
            />

            <ZKGradientButton
              :label="t('connectWallet')"
              @click="goToJomhoorSso()"
            />
          </template>

          <p><SignupAgreement /></p>
        </template>
      </StepperLayout>
    </template>
  </OnboardingLayout>
</template>

<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { useQuasar } from "quasar";
import ClusterImageExample from "src/components/onboarding/backgrounds/ClusterImageExample.vue";
import StepperLayout from "src/components/onboarding/layouts/StepperLayout.vue";
import InfoHeader from "src/components/onboarding/ui/InfoHeader.vue";
import SignupAgreement from "src/components/onboarding/ui/SignupAgreement.vue";
import ZKGradientButton from "src/components/ui-library/ZKGradientButton.vue";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import OnboardingLayout from "src/layouts/OnboardingLayout.vue";
import { Dto } from "src/shared/types/dto";
import { useLoginIntentionStore } from "src/stores/loginIntention";
import { useBackendAuthApi } from "src/utils/api/auth";
import { api } from "src/utils/api/client";
import { useCommonApi } from "src/utils/api/common";
import { buildAuthorizationHeader } from "src/utils/crypto/ucan/operation";
import { processEnv } from "src/utils/processEnv";
import { computed, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import {
    type LoginOnboardingTranslations,
    loginOnboardingTranslations,
} from "./index.i18n";

const { t } = useComponentI18n<LoginOnboardingTranslations>(
  loginOnboardingTranslations
);

const router = useRouter();
const quasar = useQuasar();
const { buildEncodedUcan } = useCommonApi();
const { updateAuthState } = useBackendAuthApi();
const { routeUserAfterLogin } = useLoginIntentionStore();

// ─── Desktop SSO QR State ─────────────────────────────────────────────────────

const ssoQrMode = ref(false);
const deepLink = ref("");
const ssoQrError = ref("");
let ssoSessionId = "";
let pollIntervalId: number | undefined = undefined;

const qrcode = useQRCode(deepLink, {
  width: 218,
  margin: 1,
  color: {
    dark: "#000000",
    light: "#0000",
  },
});

// ─── Navigation ────────────────────────────────────────────────────────────────

async function goToPhoneLogin() {
  await router.replace({ name: "/onboarding/step3-phone-1/" });
}

/** Generate a base64url-encoded SHA-256 hash (PKCE S256 code challenge). */
async function sha256Base64url(plain: string): Promise<string> {
  const encoded = new TextEncoder().encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/** Generate a cryptographically random base64url string of `byteLength` bytes. */
function randomBase64url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function goToJomhoorSso() {
  // On mobile: redirect the browser directly to sso-svc → wallet opens via deep link
  if (quasar.platform.is.mobile) {
    await goToJomhoorSsoMobileRedirect();
    return;
  }

  // On desktop: show QR code the user scans with the Jomhoor wallet app
  await startDesktopSsoQr();
}

async function goToJomhoorSsoMobileRedirect() {
  const ssoBaseUrl = processEnv.VITE_SSO_URL ?? "https://sso.jomhoor.org";
  const redirectUri = `${window.location.origin}/auth/callback`;
  const state = crypto.randomUUID();
  const codeVerifier = randomBase64url(32); // 256 bits of entropy
  const codeChallenge = await sha256Base64url(codeVerifier);

  // Persist PKCE state for the callback page.
  // localStorage (not sessionStorage) so the data survives when iOS opens the
  // callback URL in a new Safari tab via Linking.openURL from the wallet app.
  localStorage.setItem(
    "jomhoor_sso_pkce",
    JSON.stringify({ state, code_verifier: codeVerifier }),
  );

  const params = new URLSearchParams({
    client_id: "taraaz",
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${ssoBaseUrl}/v1/authorize?${params.toString()}`;
}

// ─── Desktop QR Flow ──────────────────────────────────────────────────────────

async function startDesktopSsoQr() {
  ssoQrMode.value = true;
  deepLink.value = "";
  ssoQrError.value = "";
  ssoSessionId = "";

  try {
    const url = "/api/v1/auth/sso/desktop/initiate";
    const options = { method: "post" as const };
    const encodedUcan = await buildEncodedUcan(url, options);
    const response = await api.post(
      url,
      {},
      { headers: { ...buildAuthorizationHeader(encodedUcan) } },
    );
    const data = Dto.ssoDesktopInitiate200.parse(response.data);

    if (!data.success) {
      ssoQrError.value = "Could not start sign-in. Please try again.";
      return;
    }

    ssoSessionId = data.sessionId;
    deepLink.value = data.deepLink;
    startPolling();
  } catch (e) {
    console.error("[SsoDesktop] Failed to initiate session", e);
    ssoQrError.value = "Could not start sign-in. Please try again.";
  }
}

function startPolling() {
  if (pollIntervalId !== undefined) {
    window.clearInterval(pollIntervalId);
  }
  pollIntervalId = window.setInterval(() => void pollSsoDesktopStatus(), 2000);
}

async function pollSsoDesktopStatus() {
  try {
    const url = "/api/v1/auth/sso/desktop/poll";
    const options = { method: "post" as const };
    const encodedUcan = await buildEncodedUcan(url, options);
    const response = await api.post(
      url,
      {},
      { headers: { ...buildAuthorizationHeader(encodedUcan) } },
    );
    const data = Dto.ssoDesktopPoll200.parse(response.data);

    if (!data.success) return;

    switch (data.status) {
      case "pending":
        break; // keep polling
      case "complete":
        await completeSsoDesktop();
        break;
      case "expired":
        stopPolling();
        ssoQrError.value = "QR code expired. Please try again.";
        deepLink.value = "";
        break;
      case "no_session":
        break; // session not yet created — keep polling
    }
  } catch (e) {
    console.error("[SsoDesktop] Poll error", e);
  }
}

async function completeSsoDesktop() {
  stopPolling();
  await updateAuthState({
    partialLoginStatus: { isLoggedIn: true },
    forceRefresh: true,
  });
  await routeUserAfterLogin();
}

function stopPolling() {
  if (pollIntervalId !== undefined) {
    window.clearInterval(pollIntervalId);
    pollIntervalId = undefined;
  }
}

function cancelSsoQr() {
  stopPolling();
  ssoQrMode.value = false;
  deepLink.value = "";
  ssoQrError.value = "";
  ssoSessionId = "";
}

onUnmounted(() => {
  stopPolling();
});
</script>
