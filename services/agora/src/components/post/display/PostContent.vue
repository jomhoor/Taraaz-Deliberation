<template>
  <div class="innerContainer">
    <PostMetadata
      :poster-user-name="extendedPostData.metadata.authorUsername"
      :author-username="extendedPostData.metadata.authorUsername"
      :created-at="new Date(extendedPostData.metadata.createdAt)"
      :is-edited="extendedPostData.metadata.isEdited"
      :post-slug-id="extendedPostData.metadata.conversationSlugId"
      :author-verified="false"
      :organization-url="extendedPostData.metadata.organization?.imageUrl || ''"
      :organization-name="extendedPostData.metadata.organization?.name || ''"
      :participation-mode="extendedPostData.metadata.participationMode"
      :is-closed="extendedPostData.metadata.isClosed"
      :compact-mode="compactMode"
      :conversation-title="extendedPostData.payload.title"
      @open-moderation-history="$emit('openModerationHistory')"
    />

    <div class="postDiv" :class="{ 'postDiv--compact': compactMode }">
      <div>
        <ConversationTitleWithPrivacyLabel
          :is-private="!extendedPostData.metadata.isIndexed"
          :title="extendedPostData.payload.title"
          size="medium"
          :conversation-type="extendedPostData.metadata.conversationType"
          :alignment="isCompactRtl ? 'right' : 'auto'"
          :full-width="isCompactRtl"
        />

        <EventTicketRequirementBanner
          v-if="extendedPostData.metadata.requiresEventTicket"
          :requires-event-ticket="extendedPostData.metadata.requiresEventTicket"
          :read-only="compactMode"
          @verified="(payload) => $emit('verified', payload)"
        />
      </div>

      <div
        v-if="
          extendedPostData.payload.body != undefined &&
          extendedPostData.payload.body.length > 0
        "
        class="bodyDiv"
      >
        <ZKHtmlContent
          :html-body="extendedPostData.payload.body"
          :compact-mode="compactMode"
          :enable-links="compactMode ? false : true"
          :alignment="isCompactRtl ? 'right' : 'auto'"
        />
      </div>

      <div v-if="extendedPostData.payload.poll" class="pollContainer">
        <PollWrapper
          :participation-mode="
            extendedPostData.metadata.participationMode
          "
          :poll-options="extendedPostData.payload.poll"
          :post-slug-id="extendedPostData.metadata.conversationSlugId"
          :user-response="extendedPostData.interaction"
          :requires-event-ticket="extendedPostData.metadata.requiresEventTicket"
          @ticket-verified="(payload) => $emit('verified', payload)"
        />
      </div>

      <ZKCard
        v-if="
          extendedPostData.metadata.moderation.status == 'moderated' ||
          extendedPostData.metadata.isClosed
        "
        padding="1rem"
        class="lockCardStyle"
      >
        <PostLockedMessage
          :moderation-property="extendedPostData.metadata.moderation"
          :post-slug-id="extendedPostData.metadata.conversationSlugId"
          :is-closed="extendedPostData.metadata.isClosed"
        />
      </ZKCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExtendedConversation } from "src/shared/types/zod";
import { computed, defineAsyncComponent } from "vue";

import ConversationTitleWithPrivacyLabel from "../../features/conversation/ConversationTitleWithPrivacyLabel.vue";
import ZKCard from "../../ui-library/ZKCard.vue";
import ZKHtmlContent from "../../ui-library/ZKHtmlContent.vue";
import PollWrapper from "./poll/PollWrapper.vue";
import PostLockedMessage from "./PostLockedMessage.vue";
import PostMetadata from "./PostMetadata.vue";

const props = defineProps<{
  extendedPostData: ExtendedConversation;
  compactMode: boolean;
}>();

defineEmits<{
  openModerationHistory: [];
  verified: [payload: { userIdChanged: boolean; needsCacheRefresh: boolean }];
}>();

const EventTicketRequirementBanner = defineAsyncComponent(
  () => import("../EventTicketRequirementBanner.vue")
);

const isCompactRtl = computed(() => {
  if (!props.compactMode || typeof document === "undefined") {
    return false;
  }

  return document.documentElement.getAttribute("dir") === "rtl";
});
</script>

<style scoped lang="scss">
.innerContainer {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.pollContainer {
  padding-bottom: 1rem;
}

.bodyDiv {
  padding-bottom: 1rem;
}

.postDiv {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.postDiv--compact {
  width: 100%;
}

:global(html[lang="fa"]) .postDiv--compact {
  align-items: stretch;
  text-align: right;
}

:global(html[lang="fa"]) .postDiv--compact > div,
:global(html[lang="fa"]) .postDiv--compact .bodyDiv {
  width: 100%;
}

:global(html[lang="fa"]) .postDiv--compact :deep(.title-section) {
  display: block;
  width: 100%;
}

:global(html[lang="fa"]) .postDiv--compact :deep(.conversation-title),
:global(html[lang="fa"]) .postDiv--compact :deep(.textBreak),
:global(html[lang="fa"]) .postDiv--compact :deep(.textBreak p),
:global(html[lang="fa"]) .postDiv--compact :deep(.textBreak div),
:global(html[lang="fa"]) .postDiv--compact :deep(.textBreak li) {
  direction: rtl;
  text-align: right !important;
}

.lockCardStyle {
  background-color: white;
  margin-bottom: 1rem;
}
</style>
