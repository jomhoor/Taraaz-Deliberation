<template>
  <div class="title-section">
    <div
      v-if="isPrivate"
      class="privacy-label"
      :class="`privacy-label--${size}`"
    >
      {{ t("privateLabel") }}
    </div>
    <div
      v-if="conversationType === 'maxdiff'"
      class="type-label"
      :class="`type-label--${size}`"
    >
      {{ t("prioritizationLabel") }}
    </div>
    <h1
      :dir="contentDirection"
      class="conversation-title"
      :class="[
        `conversation-title--${size}`,
        { 'conversation-title--full-width': fullWidth },
        { 'conversation-title--rtl': contentDirection === 'rtl' },
      ]"
      :style="{ textAlign: resolvedAlignment }"
    >
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import type { ConversationType } from "src/shared/types/zod";
import { computed } from "vue";

import {
  type ConversationTitleWithPrivacyLabelTranslations,
  conversationTitleWithPrivacyLabelTranslations,
} from "./ConversationTitleWithPrivacyLabel.i18n";

interface Props {
  isPrivate: boolean; // Meaning the conversation is not indexed
  title: string;
  size: "medium" | "large";
  conversationType?: ConversationType;
  alignment?: "auto" | "left" | "right";
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  conversationType: "polis",
  alignment: "auto",
  fullWidth: false,
});

const { t } = useComponentI18n<ConversationTitleWithPrivacyLabelTranslations>(
  conversationTitleWithPrivacyLabelTranslations
);

const contentDirection = computed(() => {
  if (typeof document === "undefined") {
    return "auto";
  }

  return document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
});

const resolvedAlignment = computed(() => {
  if (props.alignment !== "auto") {
    return props.alignment;
  }

  return contentDirection.value === "rtl" ? "right" : "left";
});
</script>

<style scoped lang="scss">
.title-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.privacy-label {
  background-color: #333;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: var(--font-weight-semibold);
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
}

.conversation-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: #0a0714;
  line-height: 1.3;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  text-align: start;
  unicode-bidi: plaintext;
}

.conversation-title--full-width {
  display: block;
  width: 100%;
}

.conversation-title--rtl {
  text-align: right;
  letter-spacing: 0.027em;
  word-spacing: 0.045em;
}

.conversation-title--medium {
  font-size: 1.2rem;
}

.conversation-title--large {
  font-size: 1.5rem;
}

.privacy-label--medium {
  font-size: 0.8rem;
}

.privacy-label--large {
  font-size: 0.9rem;
}

.type-label {
  background-color: $primary;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: var(--font-weight-semibold);
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
}

.type-label--medium {
  font-size: 0.8rem;
}

.type-label--large {
  font-size: 0.9rem;
}
</style>
