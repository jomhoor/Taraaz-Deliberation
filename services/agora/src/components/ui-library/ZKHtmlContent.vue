<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    :dir="contentDirection"
    class="textBreak"
    :class="{
      truncate: compactMode,
      coloredHrefs: !compactMode,
      'textBreak--rtl': contentDirection === 'rtl',
    }"
    role="user-content"
    :aria-label="compactMode ? t('postContentPreview') : t('postContent')"
    :style="{ textAlign: resolvedAlignment }"
    @click="handleClick"
    v-html="sanitizedHtmlBody"
  ></span>
</template>

<script setup lang="ts">
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import { processUserGeneratedHtml } from "src/shared-app-api/html";
import { computed } from "vue";

import {
  type ZKHtmlContentTranslations,
  zkHtmlContentTranslations,
} from "./ZKHtmlContent.i18n";

const props = defineProps<{
  htmlBody: string;
  compactMode: boolean;
  enableLinks: boolean;
  alignment?: "auto" | "left" | "right";
  // Optional explicit direction override. When provided, takes precedence over
  // the document-level direction. Used by post bodies to follow per-content
  // direction (ltr if English-only, rtl if any Farsi/Arabic/Hebrew present).
  direction?: "ltr" | "rtl";
}>();

const { t } = useComponentI18n<ZKHtmlContentTranslations>(
  zkHtmlContentTranslations
);

const contentDirection = computed(() => {
  if (props.direction) {
    return props.direction;
  }

  if (typeof document === "undefined") {
    return "auto";
  }

  return document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
});

const resolvedAlignment = computed(() => {
  if (props.alignment && props.alignment !== "auto") {
    return props.alignment;
  }

  return contentDirection.value === "rtl" ? "right" : "left";
});

const sanitizedHtmlBody = computed(() => {
  try {
    return processUserGeneratedHtml(props.htmlBody, props.enableLinks);
  } catch (error) {
    console.error("Error sanitizing HTML content:", error);
    // Fallback to plain text if sanitization fails
    // Strip tags repeatedly to handle malformed/nested tags before v-html rendering
    let text = props.htmlBody;
    let prev: string;
    do {
      prev = text;
      text = text.replace(/<[^>]*>/g, "");
    } while (text !== prev);
    return text.replace(/<[^>]*$/, "");
  }
});

const handleClick = (event: Event) => {
  const target = event.target as HTMLElement;
  // Check if the clicked element is a link or is inside a link
  const link = target.closest("a[href]");
  if (link) {
    // Prevent the click from propagating to parent elements
    event.stopPropagation();
  }
};
</script>

<style lang="scss" scoped>
.textBreak {
  display: block;
  font-size: 0.9rem;
  line-height: normal;
  text-align: start;
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
}

.textBreak--rtl {
  /* direction:rtl is set via the :dir="contentDirection" HTML attribute on the span.
     text-align:right is set via the inline :style binding.
     Writing them here causes the PostCSS RTLCSS plugin to flip them in RTL mode. */
  unicode-bidi: isolate;
  letter-spacing: 0.021em;
  word-spacing: 0.045em;
  line-height: 1.8;
}

:deep(p) {
  margin-bottom: 0.5rem;
}

:deep(p),
:deep(div),
:deep(li),
:deep(ul),
:deep(ol) {
  direction: inherit;
  text-align: inherit;
}

:deep(p:empty) {
  min-height: 1.2em;
}

:deep(ul),
:deep(ol) {
  padding-inline-start: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

:deep(li) {
  margin-bottom: 0.25rem;
}

:deep(li > p) {
  margin-bottom: 0;
}

/* Nested lists should have minimal spacing */
:deep(li ul),
:deep(li ol) {
  margin-top: 0.125rem;
  margin-bottom: 0;
}

/* Top-level unordered list uses disc */
:deep(ul) {
  list-style-type: disc;
}

/* Nested unordered lists use circle, then square */
:deep(ul ul) {
  list-style-type: circle;
}

:deep(ul ul ul) {
  list-style-type: square;
}

:deep(ol) {
  list-style-type: decimal;
  padding-inline-start: 1.75rem;
}

/* Nested ordered lists use different numbering styles */
:deep(ol ol) {
  list-style-type: lower-alpha;
}

:deep(ol ol ol) {
  list-style-type: lower-roman;
}

:deep(div) {
  margin-bottom: 0.5rem;
}

:deep(a[href]) {
  color: rgb(0, 121, 211);
  font-weight: var(--font-weight-medium);
  margin-inline-end: 0.25rem;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
}

/* Ensure any remaining potentially dangerous content is hidden */
:deep(script),
:deep(iframe),
:deep(object),
:deep(embed) {
  display: none !important;
}
</style>
