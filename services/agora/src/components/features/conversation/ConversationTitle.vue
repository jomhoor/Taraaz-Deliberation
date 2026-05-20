<template>
  <div :dir="titleDirection" class="title-section">
    <ConversationChip
      v-if="isPrivate"
      :label="t('privateLabel')"
      background-color="#333"
    />
    <ConversationChip
      v-if="conversationType === 'maxdiff'"
      :label="t('prioritizationLabel')"
      background-color="var(--q-primary)"
      icon="mdi-sort-numeric-ascending"
    />
    <ConversationChip
      v-if="externalSourceConfig !== null"
      label="GitHub"
      background-color="#24292f"
      icon="mdi-github"
    />
    <h1
      :dir="titleDirection"
      class="conversation-title"
      :class="[
        `conversation-title--${size}`,
        { 'conversation-title--rtl': titleDirection === 'rtl' },
      ]"
    >
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import type { ConversationType, ExternalSourceConfig } from "src/shared/types/zod";
import { detectTextDirection } from "src/utils/text/textDirection";
import { computed } from "vue";

import ConversationChip from "./ConversationChip.vue";
import {
  type ConversationTitleTranslations,
  conversationTitleTranslations,
} from "./ConversationTitle.i18n";

const props = defineProps<{
  isPrivate: boolean;
  title: string;
  size: "medium" | "large";
  conversationType: ConversationType;
  externalSourceConfig: ExternalSourceConfig | null;
}>();

// Direction is derived from the title's own characters, not from the app
// locale: English-only → ltr; anything containing Farsi/Arabic/Hebrew → rtl.
const titleDirection = computed(() => detectTextDirection(props.title));

const { t } = useComponentI18n<ConversationTitleTranslations>(
  conversationTitleTranslations,
);
</script>

<style scoped lang="scss">
.title-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.conversation-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: $ink-darkest;
  line-height: 1.3;
  min-width: 0;
  max-width: 100%;
}

.conversation-title--medium {
  font-size: 1.2rem;
}

.conversation-title--large {
  font-size: 1.5rem;
}

.conversation-title--rtl {
  text-align: right;
  unicode-bidi: plaintext;
}
</style>
