<template>
  <!-- 認證相關頁面：不顯示 AppShell -->
  <router-view v-if="isAuthPage" />
  
  <!-- 其他頁面：顯示 AppShell（需要登入） -->
  <AppShellAny
    v-else-if="isAuthenticated"
    :user="user"
    :tenant="tenant"
    @user-info-click="settingsOpen = true"
  >
    <!-- 內容上方麵包屑 / 說明列 -->
    <template #topbar>
      <nav class="flex items-center gap-3 text-xs text-slate-400">
        <button
          type="button"
          class="flex items-center gap-1 rounded-md border border-app-border bg-app-surface px-2 py-1 text-[11px] text-app-text-primary shadow-sm hover:bg-app-muted transition"
          @click="goBack"
        >
          <span aria-hidden="true">←</span>
          <span class="hidden sm:inline">返回上一頁</span>
        </button>
        <span class="hidden md:inline text-app-text-secondary">
          車商倉庫・車輛・維修一體化管理
        </span>
        <span class="h-4 w-px bg-slate-700/40" />
        <span class="text-app-text-secondary">
          後台控制台
        </span>
      </nav>
    </template>

    <!-- 左側 shadcn 風格 Sidebar -->
    <template #sidebar="{ collapsed }">
      <SidebarNav
        :sections="sidebarSections"
        :collapsed="collapsed"
        @item-click="handleSidebarItemClick"
        @section-click="handleSidebarSectionClick"
      />
    </template>

    <router-view />

    <!-- 類 GPT 設定面板的 Dialog -->
    <SettingsDialog
      v-model:open="settingsOpen"
      :sections="settingsSections"
    >
      <template #section="{ section }">
        <div
          v-if="section?.id === 'general'"
          class="space-y-3"
        >
          <!-- 主題選擇器 -->
          <div class="space-y-2">
            <div>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                介面主題
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                選擇您偏好的介面外觀，可選擇淺色、暗色或跟隨系統設定。
              </p>
            </div>
            
            <div class="grid grid-cols-3 gap-2 mt-3">
              <!-- 淺色模式 -->
              <button
                type="button"
                class="flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/20': themeMode === 'light',
                  'border-slate-200 dark:border-slate-700': themeMode !== 'light'
                }"
                @click="setThemeMode('light')"
              >
                <div class="flex h-12 w-full items-center justify-center gap-1 rounded bg-white border border-slate-200">
                  <div class="h-full w-1/3 rounded-l bg-slate-100" />
                  <div class="h-full w-2/3 rounded-r bg-white" />
                </div>
                <span
                  class="text-xs font-medium"
                  :class="themeMode === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'"
                >
                  淺色
                </span>
              </button>

              <!-- 暗色模式 -->
              <button
                type="button"
                class="flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/20': themeMode === 'dark',
                  'border-slate-200 dark:border-slate-700': themeMode !== 'dark'
                }"
                @click="setThemeMode('dark')"
              >
                <div class="flex h-12 w-full items-center justify-center gap-1 rounded bg-slate-900 border border-slate-700">
                  <div class="h-full w-1/3 rounded-l bg-slate-800" />
                  <div class="h-full w-2/3 rounded-r bg-slate-900" />
                </div>
                <span
                  class="text-xs font-medium"
                  :class="themeMode === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'"
                >
                  暗色
                </span>
              </button>

              <!-- 系統模式 -->
              <button
                type="button"
                class="flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/20': themeMode === 'system',
                  'border-slate-200 dark:border-slate-700': themeMode !== 'system'
                }"
                @click="setThemeMode('system')"
              >
                <div class="relative flex h-12 w-full items-center justify-center gap-1 rounded bg-gradient-to-br from-white to-slate-900 border border-slate-200 dark:border-slate-700">
                  <div class="absolute left-0 top-0 h-1/2 w-1/3 rounded-tl bg-slate-100" />
                  <div class="absolute left-0 top-1/2 h-1/2 w-1/3 rounded-bl bg-slate-800" />
                  <div class="absolute right-0 top-0 h-full w-2/3 rounded-r bg-slate-900" />
                </div>
                <span
                  class="text-xs font-medium"
                  :class="themeMode === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'"
                >
                  系統
                </span>
              </button>
            </div>

            <!-- 當前主題顯示 -->
            <div class="mt-3 flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
              <span class="text-xs text-slate-600 dark:text-slate-400">
                目前使用：
              </span>
              <span
                class="rounded-full px-3 py-1 text-xs font-medium"
                :class="{
                  'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200': effectiveTheme === 'light',
                  'bg-slate-800 text-slate-100': effectiveTheme === 'dark'
                }"
              >
                {{ effectiveTheme === 'light' ? '淺色模式' : '暗色模式' }}
                <span
                  v-if="themeMode === 'system'"
                  class="ml-1 text-[10px] opacity-70"
                >
                  (系統)
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          v-else-if="section?.id === 'notifications'"
          class="space-y-2"
        >
          <p class="text-xs text-slate-500">
            之後可以在這裡調整：庫存過低、車輛待整備、維修報價到期等通知頻率。
          </p>
        </div>

        <div
          v-else-if="section?.id === 'account'"
          class="space-y-4"
        >
          <!-- 帳號資訊 -->
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                帳號資訊
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                顯示目前登入帳號與組織資訊
              </p>
            </div>
            
            <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                  {{ (user?.display_name || user?.email || "U").slice(0, 1).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {{ user?.display_name || "未設定名稱" }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              
              <div v-if="tenant" class="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  所屬租戶
                </p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {{ tenant.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- 安全設定 -->
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                安全設定
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                未來可以加入密碼修改、多重驗證等安全設定
              </p>
            </div>
          </div>

          <!-- 登出按鈕 -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              class="w-full rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              @click="handleLogout"
            >
              登出
            </button>
          </div>
        </div>
      </template>
    </SettingsDialog>
  </AppShellAny>
  
  <!-- 未登入且不是公開頁面：顯示載入中（路由守衛會處理重導向） -->
  <div
    v-else-if="!loading && !isAuthenticated && !isAuthPage"
    class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900"
  >
    <div class="text-center">
      <div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p class="text-sm text-slate-600 dark:text-slate-400">
        正在導向...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AppShell } from "@ui";
import SidebarNav from "@/components/SidebarNav.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import { useAuth, initAuthState } from "@/composables/useAuth";
import { useTheme, type ThemeMode } from "@/composables/useTheme";

const AppShellAny = AppShell as any;

const { user, tenant, logout, loading, isAuthenticated, hasTenant } = useAuth();
const router = useRouter();
const route = useRoute();

// 檢查是否為認證相關頁面或行銷頁面（不需要 AppShell）
const isAuthPage = computed(() => {
  const authPages = ["login", "auth-callback", "reset-password", "landing", "onboarding", "tenant-setup"];
  return authPages.includes(route.name as string);
});

// 主題管理
const { themeMode, effectiveTheme, setThemeMode } = useTheme();

const sidebarSections = [
  {
    id: "inventory",
    label: "後台管理清單",
    icon: "🛖",
    items: [
      { id: "inventory-dashboard", label: "車輛入庫", to: "/manager/inventory" },
      { id: "warehouses", label: "倉庫據點管理", to: "/manager/warehouses" },
      { id: "partners", label: "維修 / 服務廠", to: "/manager/partners" }
    ]
  },
  {
    id: "org",
    label: "組織與權限",
    icon: "🏢",
    items: [
      { id: "organization", label: "組織管理", to: "/organization" },
      { id: "manager-root", label: "數據總覽", to: "/manager" }
    ]
  }
];

const settingsOpen = ref(false);

const settingsSections = [
  {
    id: "general",
    label: "一般",
    description: "介面語言、主題與整體偏好設定。"
  },
  {
    id: "notifications",
    label: "通知",
    description: "庫存、車輛、收購與銷售相關提醒。"
  },
  {
    id: "account",
    label: "帳戶",
    description: "登入帳號與安全性設定。"
  }
] ;

function handleSidebarItemClick(item: { id: string; to?: string }) {
  if (item.id === "account-settings") {
    settingsOpen.value = true;
  } else if (item.to) {
    // 如果有 to 屬性，導向到該路由
    router.push(item.to);
  }
}

function handleSidebarSectionClick(section: { id: string }) {
  // 帳戶與偏好設定已改為點擊 user info 開啟，這裡不再處理
}

function goBack() {
  router.back();
}

async function handleLogout() {
  try {
    await logout();
    // 登出後導向登入頁面
    router.push("/login");
  } catch (error) {
    console.error("登出失敗", error);
  }
}

onMounted(async () => {
  await initAuthState();
});
</script>

