<template>
  <WidthWrapper :enable="true">
    <div :class="['topMenu', { 'topMenu--rtl': isRtl }]">
      <slot />
    </div>
  </WidthWrapper>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed } from "vue";

import WidthWrapper from "../WidthWrapper.vue";

const $q = useQuasar();
const isRtl = computed(() => $q.lang.rtl === true);
</script>

<style scoped lang="scss">
.topMenu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-top: 0.5rem;

  &--rtl {
    flex-direction: row-reverse;
  }
}
</style>
