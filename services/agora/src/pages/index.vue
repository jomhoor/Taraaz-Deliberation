<template>
  <div class="pageContent">
    <Teleport v-if="isActive" to="#page-header">
      <HomeMenuBar>
        <template #center>
          <img
            v-if="drawerBehavior == 'mobile'"
            src="/images/icons/agora-wings.svg"
            class="agoraLogoStyle"
          />
        </template>
      </HomeMenuBar>

      <!--
        On mobile the Popular/New tabs sit in the header (next to the logo).
        On desktop they're teleported into the right-side SideDrawer below.
      -->
      <WidthWrapper v-if="drawerBehavior == 'mobile'" :enable="true">
        <div class="tabCluster">
          <div class="tabItem" @click="selectedTab('following')">
            <ZKBadge
              :visible="hasPendingFollowingTab && currentHomeFeedTab !== 'following'"
            >
              <ZKTab
                :text="isLoggedIn ? t('following') : t('popular')"
                :is-highlighted="currentHomeFeedTab === 'following'"
                :should-underline-on-highlight="false"
              />
            </ZKBadge>
          </div>

          <!-- TODO: ACCESSIBILITY - Change <div> wrapper to semantic <button> or add proper ARIA attributes -->
          <!-- Tab navigation should be keyboard accessible for users with motor disabilities -->
          <div class="tabItem" @click="selectedTab('new')">
            <ZKBadge
              :visible="hasPendingNewTab && currentHomeFeedTab !== 'new'"
            >
              <ZKTab
                :text="t('new')"
                :is-highlighted="currentHomeFeedTab === 'new'"
                :should-underline-on-highlight="false"
              />
            </ZKBadge>
          </div>
        </div>
      </WidthWrapper>
    </Teleport>

    <Teleport v-if="isActive && drawerBehavior == 'desktop'" to="#side-drawer-extras">
      <div class="drawerTabList">
        <div
          class="drawerTabItem"
          :class="{ activeRoute: currentHomeFeedTab === 'following' }"
          @click="selectedTab('following')"
        >
          <div class="drawerTabIcon">
            <ZKBadge
              :visible="hasPendingFollowingTab && currentHomeFeedTab !== 'following'"
            >
              <ZKIcon
                name="material-symbols:local-fire-department-rounded"
                size="1.5rem"
                :color="
                  currentHomeFeedTab === 'following' ? '#6B4EFF' : '#7D7A85'
                "
              />
            </ZKBadge>
          </div>
          <div class="drawerTabName">
            {{ isLoggedIn ? t("following") : t("popular") }}
          </div>
        </div>

        <div
          class="drawerTabItem"
          :class="{ activeRoute: currentHomeFeedTab === 'new' }"
          @click="selectedTab('new')"
        >
          <div class="drawerTabIcon">
            <ZKBadge :visible="hasPendingNewTab && currentHomeFeedTab !== 'new'">
              <ZKIcon
                name="material-symbols:auto-awesome-rounded"
                size="1.5rem"
                :color="currentHomeFeedTab === 'new' ? '#6B4EFF' : '#7D7A85'"
              />
            </ZKBadge>
          </div>
          <div class="drawerTabName">{{ t("new") }}</div>
        </div>
      </div>
    </Teleport>

    <q-pull-to-refresh @refresh="pullDownTriggered">
      <div class="bannerWrapper">
        <WidthWrapper :enable="true">
          <FeaturedConversationBanner />
        </WidthWrapper>
      </div>

      <div class="container">
        <CompactPostList ref="compactPostListRef" />
      </div>
    </q-pull-to-refresh>

    <NewPostButtonWrapper />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CompactPostList from "src/components/feed/CompactPostList.vue";
import FeaturedConversationBanner from "src/components/feed/FeaturedConversationBanner.vue";
import { HomeMenuBar } from "src/components/navigation/header/variants";
import WidthWrapper from "src/components/navigation/WidthWrapper.vue";
import NewPostButtonWrapper from "src/components/post/NewPostButtonWrapper.vue";
import ZKBadge from "src/components/ui-library/ZKBadge.vue";
import ZKIcon from "src/components/ui-library/ZKIcon.vue";
import ZKTab from "src/components/ui-library/ZKTab.vue";
import { usePageLayout } from "src/composables/layout/usePageLayout";
import { useComponentI18n } from "src/composables/ui/useComponentI18n";
import { useAuthenticationStore } from "src/stores/authentication";
import type { HomeFeedSortOption } from "src/stores/homeFeed";
import { useHomeFeedStore } from "src/stores/homeFeed";
import { useNavigationStore } from "src/stores/navigation";
import { useInvalidateFeedQuery } from "src/utils/api/post/useFeedQuery";
import { ref } from "vue";

import { type HomeTranslations, homeTranslations } from "./index.i18n";

defineOptions({ name: "HomePage" });

interface CompactPostListExposed {
  refreshFeed: (done: () => void) => void;
}

const { isActive } = usePageLayout({});

const { t } = useComponentI18n<HomeTranslations>(homeTranslations);

const { drawerBehavior } = storeToRefs(useNavigationStore());

const { currentHomeFeedTab, hasPendingNewTab, hasPendingFollowingTab } =
  storeToRefs(useHomeFeedStore());
const { clearFeedDisplay } = useHomeFeedStore();
const { isLoggedIn } = storeToRefs(useAuthenticationStore());
const { invalidateFeedTab } = useInvalidateFeedQuery();
const compactPostListRef = ref<CompactPostListExposed | null>(null);

function pullDownTriggered(done: () => void): void {
  if (compactPostListRef.value) {
    compactPostListRef.value.refreshFeed(done);
    return;
  }

  done();
}

function selectedTab(tab: HomeFeedSortOption) {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const hadPending = tab === "new" ? hasPendingNewTab.value : hasPendingFollowingTab.value;

  if (currentHomeFeedTab.value === tab) {
    if (hadPending) {
      if (tab === "new") {
        hasPendingNewTab.value = false;
      } else {
        hasPendingFollowingTab.value = false;
      }
      invalidateFeedTab(tab);
    }
    return;
  }

  clearFeedDisplay();
  currentHomeFeedTab.value = tab;
  if (tab === "new") {
    hasPendingNewTab.value = false;
  } else {
    hasPendingFollowingTab.value = false;
  }
  if (hadPending) {
    invalidateFeedTab(tab);
  }
}
</script>

<style scoped lang="scss">
.pageContent {
  padding-top: 0.5rem;
}

.bannerWrapper {
  margin-bottom: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agoraLogoStyle {
  width: 2rem;
  height: 1.75rem;
}

.tabCluster {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  font-weight: var(--font-weight-semibold);
  font-size: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
}

// Desktop-only drawer tab list. Mirrors the dimensions and rhythm of the
// existing nav items in SideDrawer (خانه/کاوش/تنظیمات) so the
// teleported tabs feel like a native part of the drawer.
.drawerTabList {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.drawerTabItem {
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  height: 3.5rem;
  border-radius: 15px;
  cursor: pointer;
  color: $ink-darkest;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.activeRoute {
    font-weight: var(--font-weight-bold);
    color: $primary;
  }
}

.drawerTabIcon {
  position: relative;
  width: 2rem;
  display: flex;
  justify-content: center;
}

.drawerTabName {
  flex: 1;
  padding-bottom: 0.4rem;
}

.tabItem {
  min-width: 8rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 15px;
}

.tabItem:hover {
  cursor: pointer;
}

@media (min-width: $breakpoint-sm-min) {
  .tabCluster {
    padding-top: 1rem;
  }
}
</style>
