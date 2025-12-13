/**
 * Vue Composable for Authentication
 * 提供響應式的認證狀態管理
 */

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { User, Tenant, TenantMember, AuthContext } from "@core";
import {
  initAuth as coreInitAuth,
  clearAuth as coreClearAuth,
  setCurrentTenant as coreSetCurrentTenant,
  getAuthContext as coreGetAuthContext,
  getCurrentTenantId,
  getCurrentUserId,
  getCurrentUserRole
} from "@core";
import { supabaseClient } from "@core";

// 響應式狀態
const user = ref<User | null>(null);
const tenant = ref<Tenant | null>(null);
const member = ref<TenantMember | null>(null);
const loading = ref(true);

// 監聽 Supabase Auth 狀態變化
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    await refreshAuth();
  } else if (event === "SIGNED_OUT") {
    user.value = null;
    tenant.value = null;
    member.value = null;
  }
});

/**
 * 重新整理認證狀態
 */
async function refreshAuth() {
  loading.value = true;
  try {
    const context = await coreInitAuth();
    user.value = context.user;
    tenant.value = context.tenant;
    member.value = context.member;
  } catch (error) {
    console.error("重新整理認證狀態失敗", error);
  } finally {
    loading.value = false;
  }
}

/**
 * 登出
 */
async function logout() {
  try {
    await supabaseClient.auth.signOut();
    coreClearAuth();
    user.value = null;
    tenant.value = null;
    member.value = null;
  } catch (error) {
    console.error("登出失敗", error);
    throw error;
  }
}

/**
 * 切換租戶
 */
async function switchTenant(tenantId: string) {
  loading.value = true;
  try {
    const context = await coreSetCurrentTenant(tenantId);
    user.value = context.user;
    tenant.value = context.tenant;
    member.value = context.member;
  } catch (error) {
    console.error("切換租戶失敗", error);
    throw error;
  } finally {
    loading.value = false;
  }
}

/**
 * 檢查是否已登入
 */
const isAuthenticated = computed(() => {
  return user.value !== null;
});

/**
 * 檢查是否已選擇租戶
 */
const hasTenant = computed(() => {
  return tenant.value !== null;
});

export function useAuth() {
  return {
    user: computed(() => user.value),
    tenant: computed(() => tenant.value),
    member: computed(() => member.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    hasTenant,
    refreshAuth,
    logout,
    switchTenant,
    getCurrentTenantId,
    getCurrentUserId,
    getCurrentUserRole
  };
}

// 初始化認證狀態（在應用啟動時調用）
export async function initAuthState() {
  if (!user.value) {
    await refreshAuth();
  }
}

