<template>
  <OnboardingLayout>
    <template #body><DefaultImageExample /></template>

    <template #footer>
      <StepperLayout
        :submit-call-back="() => {}"
        :current-step="1"
        :total-steps="5"
        :enable-next-button="false"
        :show-next-button="false"
        :show-loading-button="isLoading"
      >
        <template #header>
          <InfoHeader
            :title="errorMessage ? t('errorTitle') : t('loadingTitle')"
            :description="errorMessage ?? t('loadingDescription')"
            icon-name="mdi-account-key"
          />
        </template>

        <template #body>
          <div v-if="errorMessage" class="flex flex-col gap-4">
            <ZKGradientButton
              :label="t('retryButton')"
              @click="goBack()"
            />
          </div>
        </template>
      </StepperLayout>
    </template>
  </OnboardingLayout>
</template>

<script setup lang="ts">
import DefaultImageExample from "src/components/onboarding/backgrounds/DefaultImageExample.vue";
import StepperLayout from "src/components/onboarding/layouts/StepperLayout.vue";
import InfoHeader from "src/components/onboarding/ui/InfoHeader.vue";
import ZKGradientButton from "src/components/ui-library/ZKGradientButton.vue";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import { useVerificationComplete } from "src/composables/verification/useVerificationComplete";
import OnboardingLayout from "src/layouts/OnboardingLayout.vue";
import { api } from "src/utils/api/client";
import { useCommonApi } from "src/utils/api/common";
import { buildAuthorizationHeader } from "src/utils/crypto/ucan/operation";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { type SsoCallbackTranslations, ssoCallbackTranslations } from "./index.i18n";

const { t } = useComponentI18n<SsoCallbackTranslations>(ssoCallbackTranslations);

const route = useRoute();
const router = useRouter();
const { buildEncodedUcan } = useCommonApi();
const { completeVerification } = useVerificationComplete();

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

async function goBack() {
  await router.replace({ name: "/onboarding/step1-login/" });
}

onMounted(async () => {
  const code = route.query["code"];
  const returnedState = route.query["state"];

  // Read PKCE data stored before the SSO redirect.
  // Uses localStorage (not sessionStorage) because iOS opens the callback URL
  // in a new Safari tab via Linking.openURL, which has no sessionStorage.
  const rawPkce = localStorage.getItem("jomhoor_sso_pkce");
  localStorage.removeItem("jomhoor_sso_pkce");

  if (!code || typeof code !== "string") {
    errorMessage.value = t("errorMissingCode");
    isLoading.value = false;
    return;
  }

  if (!rawPkce) {
    errorMessage.value = t("errorMissingVerifier");
    isLoading.value = false;
    return;
  }

  let pkce: { state: string; code_verifier: string };
  try {
    pkce = JSON.parse(rawPkce) as { state: string; code_verifier: string };
  } catch {
    errorMessage.value = t("errorMissingVerifier");
    isLoading.value = false;
    return;
  }

  // CSRF: state must match
  if (returnedState !== pkce.state) {
    errorMessage.value = t("errorStateMismatch");
    isLoading.value = false;
    return;
  }

  try {
    const url = "/api/v1/auth/sso/exchange";
    const body = { code, code_verifier: pkce.code_verifier };

    // Build UCAN for this request (creates DID keypair if needed)
    const encodedUcan = await buildEncodedUcan(url, { method: "post" });

    const resp = await api.post<{ success: boolean; userId?: string; accountMerged?: boolean; reason?: string }>(
      url,
      body,
      { headers: { ...buildAuthorizationHeader(encodedUcan) } },
    );

    const result = resp.data;

    if (!result.success) {
      if (result.reason === "invalid_code") {
        errorMessage.value = t("errorInvalidCode");
      } else if (result.reason === "associated_with_another_user") {
        errorMessage.value = t("errorAssociatedWithAnotherUser");
      } else {
        errorMessage.value = t("errorGeneric");
      }
      isLoading.value = false;
      return;
    }

    // Auth succeeded — sync session state then route user
    await completeVerification();
  } catch (err) {
    console.error("[SSO callback] Exchange failed", err);
    errorMessage.value = t("errorGeneric");
    isLoading.value = false;
  }
});
</script>
