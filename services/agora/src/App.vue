<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveRoutes">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <PostSignupPreferencesDialog />
  <EmbeddedBrowserWarningDialog />

  <!-- Global Zupass iframe container - shared by all components -->
  <!-- Parcnet creates its own dialog with overlay, positioned fixed -->
  <div ref="zupassIframeContainer" class="zupass-iframe-container"></div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import EmbeddedBrowserWarningDialog from "./components/embeddedBrowser/EmbeddedBrowserWarningDialog.vue";
import PostSignupPreferencesDialog from "./components/onboarding/dialogs/PostSignupPreferencesDialog.vue";
import { useNotificationSSE } from "./composables/useNotificationSSE";
import { useZupassVerification } from "./composables/zupass/useZupassVerification";
import { useAuthenticationStore } from "./stores/authentication";
import { onboardingFlowStore } from "./stores/onboarding/flow";
import { useBackendAuthApi } from "./utils/api/auth";
import { useHtmlNodeCssPatch } from "./utils/css/htmlNodeCssPatch";

const keepAliveRoutes = ["NotificationPage", "UserProfilePage"];

const authenticationStore = useBackendAuthApi();
const authStore = useAuthenticationStore();
const router = useRouter();

useHtmlNodeCssPatch();

// Initialize global Zupass iframe container
const { zupassIframeContainer } = useZupassVerification();

// Initialize SSE for real-time notifications
// The composable automatically handles connecting/disconnecting based on auth state
useNotificationSSE();

const isJomhoorWebView =
  typeof window !== "undefined" &&
  !!(window as unknown as Record<string, unknown>).__JOMHOOR__;

onMounted(async () => {
  try {
    // Skip auth initialization on the SSO callback route.
    // The callback page handles auth completion itself (POST /auth/sso/exchange
    // followed by completeVerification). Running initializeAuthState here would
    // hit check-login-status before the exchange completes, see isKnown=false,
    // and call logoutDataCleanup → deleteDid(), wiping the device keypair from
    // IndexedDB. The exchange then succeeds for that old key, but the next
    // check-login-status creates a fresh key, so the device record cannot be
    // found and the user is logged out instead of in.
    const path =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (path.startsWith("/auth/callback")) {
      console.log("[App] On SSO callback route — skipping initializeAuthState");
      const { isAuthInitialized } = storeToRefs(useAuthenticationStore());
      isAuthInitialized.value = true;
      return;
    }

    await authenticationStore.initializeAuthState();

    // Jomhoor WebView auto-login: after auth is checked, if the user
    // is not logged in redirect straight to wallet auth so the native
    // app can submit credentials automatically via postMessage.
    if (isJomhoorWebView && !authStore.isLoggedIn) {
      const flowStore = onboardingFlowStore();
      flowStore.onboardingMode = "LOGIN";
      console.log(
        "[App] Jomhoor WebView detected, not logged in — redirecting to wallet auth"
      );
      await router.push({ name: "/onboarding/step3-wallet/" });
    }
  } catch (e) {
    console.error("Error while trying to get logged-in status", e);
    // WebCrypto requires a secure context (HTTPS or localhost).
    // In dev mode, enable basicSsl in quasar.config.ts to serve over HTTPS.
    // This fallback ensures the UI doesn't get stuck if auth init fails.
    if (process.env.DEV) {
      const { isAuthInitialized } = storeToRefs(useAuthenticationStore());
      isAuthInitialized.value = true;
    }
  }
});
</script>

<style lang="scss">
.zupass-iframe-container {
  // Empty container - Parcnet will inject iframe and dialog
  // Dialog is positioned fixed with its own backdrop, doesn't need special styling here
}
</style>
