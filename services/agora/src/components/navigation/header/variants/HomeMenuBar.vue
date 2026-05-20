<template>
  <DefaultMenuBar>
    <template #left>
      <MenuButton />
    </template>
    <template #middle>
      <slot name="center" />
    </template>
    <template v-if="drawerBehavior == 'mobile'" #right>
      <!--
        Login button only shows in the top bar on mobile. On desktop it lives
        in the right-side SideDrawer (alongside خانه/کاوش/تنظیمات).
      -->
      <LoginButton />
    </template>
  </DefaultMenuBar>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMenuBarActions } from "src/composables/ui/useMenuBarActions";
import { useNavigationStore } from "src/stores/navigation";

import DefaultMenuBar from "../DefaultMenuBar.vue";

const { MenuButton, LoginButton } = useMenuBarActions();
const { drawerBehavior } = storeToRefs(useNavigationStore());
</script>
