<template>
  <NavigationButton
    :icon="backIcon"
    aria-label="Go back"
    :fallback-route="fallbackRoute"
  />
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import NavigationButton from "src/components/navigation/NavigationButton.vue";
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

interface Props {
  fallbackRoute?: RouteLocationRaw;
}

withDefaults(defineProps<Props>(), {
  fallbackRoute: () => ({ name: "/" }),
});

const $q = useQuasar();
const backIcon = computed(() => ($q.lang.rtl === true ? "ci:chevron-right" : "ci:chevron-left"));
</script>
