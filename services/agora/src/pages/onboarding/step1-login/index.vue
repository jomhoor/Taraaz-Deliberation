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
          <ZKGradientButton
            :label="t('loginWithPhone')"
            @click="goToPhoneLogin()"
          />

          <ZKGradientButton
            :label="t('connectWallet')"
            @click="goToJomhoorSso()"
          />

          <p><SignupAgreement /></p>
        </template>
      </StepperLayout>
    </template>
  </OnboardingLayout>
</template>

<script setup lang="ts">
import ClusterImageExample from "src/components/onboarding/backgrounds/ClusterImageExample.vue";
import StepperLayout from "src/components/onboarding/layouts/StepperLayout.vue";
import InfoHeader from "src/components/onboarding/ui/InfoHeader.vue";
import SignupAgreement from "src/components/onboarding/ui/SignupAgreement.vue";
import ZKGradientButton from "src/components/ui-library/ZKGradientButton.vue";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import OnboardingLayout from "src/layouts/OnboardingLayout.vue";
import { processEnv } from "src/utils/processEnv";
import { useRouter } from "vue-router";

import {
    type LoginOnboardingTranslations,
    loginOnboardingTranslations,
} from "./index.i18n";

const { t } = useComponentI18n<LoginOnboardingTranslations>(
  loginOnboardingTranslations
);

const router = useRouter();

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
  const ssoBaseUrl = processEnv.VITE_SSO_URL ?? "https://sso.jomhoor.org";
  const redirectUri = `${window.location.origin}/auth/callback`;
  const state = crypto.randomUUID();
  const codeVerifier = randomBase64url(32); // 256 bits of entropy
  const codeChallenge = await sha256Base64url(codeVerifier);

  // Persist PKCE state for the callback page
  sessionStorage.setItem(
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
</script>
