<template>
  <OnboardingLayout>
    <template #body><ClusterImageExample /> </template>

    <template #footer>
      <StepperLayout
        :submit-call-back="() => {}"
        :current-step="2"
        :total-steps="5"
        :enable-next-button="true"
        :show-next-button="false"
        :show-loading-button="false"
      >
        <template #header>
          <InfoHeader
            :title="t('pageTitle')"
            :description="t('description')"
            icon-name="mdi-heart"
          />
        </template>

        <template #body>
          <ZKGradientButton
            :label="t('verifyWithPhone')"
            @click="verifyPhone()"
          />

          <div class="wallet-coming-soon">
            <ZKGradientButton
              :label="t('connectWallet')"
              gradient-background="#E0E0E0"
              label-color="#9E9E9E"
              disabled
              class="disabled-button"
            />
            <span class="coming-soon-badge">{{ t('comingSoon') }}</span>
          </div>

          <p>
            <SignupAgreement />
          </p>
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
import { useRouter } from "vue-router";

import {
    type Step2SignupOnboardingTranslations,
    step2SignupOnboardingTranslations,
} from "./index.i18n";

const { t } = useComponentI18n<Step2SignupOnboardingTranslations>(
  step2SignupOnboardingTranslations
);

const router = useRouter();

async function verifyPhone() {
  await router.push({ name: "/onboarding/step3-phone-1/" });
}
</script>

<style scoped lang="scss">
.wallet-coming-soon {
  position: relative;
  opacity: 0.6;
}

.wallet-coming-soon .disabled-button {
  pointer-events: none;
  cursor: not-allowed;
}

.coming-soon-badge {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: #9E9E9E;
  margin-top: 4px;
}
</style>
