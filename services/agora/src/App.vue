<template>
  <PersistentLayout v-if="isDrawerLayout">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRoutes">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </PersistentLayout>

  <!-- Non-drawer pages (onboarding, embed, welcome, survey onboarding, 404) render their own layout -->
  <router-view v-else />

  <PostSignupPreferencesDialog />
  <EmbeddedBrowserWarningDialog />

  <!-- Global Zupass iframe container - shared by all components -->
  <!-- Parcnet creates its own dialog with overlay, positioned fixed -->
  <div ref="zupassIframeContainer" class="zupass-iframe-container"></div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { type AppTranslations, appTranslations } from "./App.i18n";
import EmbeddedBrowserWarningDialog from "./components/embeddedBrowser/EmbeddedBrowserWarningDialog.vue";
import PostSignupPreferencesDialog from "./components/onboarding/dialogs/PostSignupPreferencesDialog.vue";
import { createOfflineNotificationController } from "./composables/offlineNotification";
import { useComponentI18n } from "./composables/ui/useComponentI18n";
import { isNetworkOffline } from "./composables/useNetworkStatus";
import { useRealtimeSSE } from "./composables/useRealtimeSSE";
import { useZupassVerification } from "./composables/zupass/useZupassVerification";
import PersistentLayout from "./layouts/PersistentLayout.vue";
import { useAuthenticationStore } from "./stores/authentication";
import { onboardingFlowStore } from "./stores/onboarding/flow";
import { useBackendAuthApi } from "./utils/api/auth";
import { useHtmlNodeCssPatch } from "./utils/css/htmlNodeCssPatch";
import { useNotify } from "./utils/ui/notify";

const { t } = useComponentI18n<AppTranslations>(appTranslations);

const keepAliveRoutes = ["HomePage", "NotificationPage", "UserProfilePage"];

const authenticationStore = useBackendAuthApi();
const authStore = useAuthenticationStore();
const router = useRouter();

useHtmlNodeCssPatch();

// Initialize global Zupass iframe container
const { zupassIframeContainer } = useZupassVerification();

// Initialize SSE for real-time events (notifications + feed updates).
// Always connected: authenticated users get personal notifications + global
// events; anonymous users get only global events (e.g. new_conversation).
useRealtimeSSE();

// Determine layout mode from route name
const route = useRoute();
const nonDrawerRoutePatterns = [
  "/onboarding/",
  "/verify/",
  "/welcome",
  "/conversation/[postSlugId].onboarding",
  "/[...all]",
];

const isDrawerLayout = computed(() => {
  const name = String(route.name ?? "");
  if (name.includes(".embed")) return false;
  return !nonDrawerRoutePatterns.some((pattern) => name.startsWith(pattern));
});

const { showNotifyMessage, showPersistentNotifyMessage } = useNotify();

// Offline notification — state machine handles show/dismiss logic.
// Quasar dismiss reference tracked here (not in the state machine) since
// it is a framework-specific side effect.
let dismissOfflineFn: (() => void) | null = null;

const offlineController = createOfflineNotificationController({
  showOffline: () => {
    let thisDismiss: (() => void) | null = null;
    thisDismiss = showPersistentNotifyMessage({
      message: t("connectionLost"),
      caption: t("reconnecting"),
      showSpinner: true,
      group: "offline-notification",
      onDismiss: () => {
        if (dismissOfflineFn === thisDismiss) {
          dismissOfflineFn = null;
        }
      },
    });
    dismissOfflineFn = thisDismiss;
  },
  dismissOffline: () => {
    dismissOfflineFn?.();
    dismissOfflineFn = null;
  },
  showConnected: () => {
    showNotifyMessage(t("connected"));
  },
});

watch(isNetworkOffline, (offline) => {
  if (offline) {
    offlineController.onWentOffline();
  } else {
    offlineController.onWentOnline();
  }
}, { flush: 'sync' });

const isJomhoorWebView =
  typeof window !== "undefined" &&
  !!(window as unknown as Record<string, unknown>).__JOMHOOR__;

onMounted(async () => {
  // Remove SPA splash screen (only present in SPA builds, see index.html)
  const splash = document.getElementById("app-loading");
  if (splash) {
    splash.classList.add("fade-out");
    splash.addEventListener("transitionend", () => splash.remove(), { once: true });
    setTimeout(() => splash.remove(), 500);
  }

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
    // is not logged in redirect to step1-login. The SSO bridge in
    // step1-login auto-detects the WebView and initiates the desktop-session
    // SSO flow, postMessaging the deep link to the native shell.
    if (isJomhoorWebView && !authStore.isLoggedIn) {
      const flowStore = onboardingFlowStore();
      flowStore.onboardingMode = "LOGIN";
      console.log(
        "[App] Jomhoor WebView detected, not logged in — redirecting to SSO login"
      );
      await router.push({ name: "/onboarding/step1-login/" });
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
