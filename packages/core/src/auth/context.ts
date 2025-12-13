/**
 * 認證與多租戶 Context（純 TypeScript，不依賴框架）
 * 提供全域的認證狀態管理
 */

import type { User, Tenant, TenantMember, AuthContext } from "./types";
import { supabaseClient } from "../supabase/client";

// 全域狀態（純 TypeScript，不使用 Vue 的 ref）
let currentUser: User | null = null;
let currentTenant: Tenant | null = null;
let currentMember: TenantMember | null = null;
let isLoading = false;

/**
 * 取得當前租戶 ID
 */
export function getCurrentTenantId(): string | null {
  return currentTenant?.id ?? null;
}

/**
 * 取得當前使用者 ID
 */
export function getCurrentUserId(): string | null {
  return currentUser?.id ?? null;
}

/**
 * 取得當前使用者角色
 */
export function getCurrentUserRole(): string | null {
  return currentMember?.role ?? null;
}

/**
 * 取得完整的認證 Context
 */
export function getAuthContext(): AuthContext {
  return {
    user: currentUser,
    tenant: currentTenant,
    member: currentMember,
    loading: isLoading
  };
}

/**
 * 初始化認證（從 Supabase Auth 載入使用者資訊）
 */
export async function initAuth(): Promise<AuthContext> {
  isLoading = true;
  try {
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !authUser) {
      currentUser = null;
      currentTenant = null;
      currentMember = null;
      return getAuthContext();
    }

    // 載入使用者資料（profiles）
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, display_name, phone, avatar_url")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      currentUser = {
        id: authUser.id,
        email: authUser.email ?? "",
        display_name: null,
        phone: null,
        avatar_url: null
      };
    } else {
      currentUser = {
        id: profile.id,
        email: authUser.email ?? "",
        display_name: profile.display_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url
      };
    }

    // 載入租戶成員資訊（預設載入第一個 active 的租戶）
    const { data: members, error: membersError } = await supabaseClient
      .from("tenant_members")
      .select(`
        id, tenant_id, user_id, role, permissions, status, created_at,
        tenants!inner(id, name, plan_type, status, config, created_at, updated_at)
      `)
      .eq("user_id", authUser.id)
      .eq("status", "active")
      .limit(1);

    if (membersError || !members || members.length === 0) {
      currentTenant = null;
      currentMember = null;
      return getAuthContext();
    }

    const member = members[0] as any;
    currentMember = {
      id: member.id,
      tenant_id: member.tenant_id,
      user_id: member.user_id,
      role: member.role,
      permissions: member.permissions,
      status: member.status,
      created_at: member.created_at
    };

    currentTenant = {
      id: member.tenants.id,
      name: member.tenants.name,
      plan_type: member.tenants.plan_type,
      status: member.tenants.status,
      config: member.tenants.config,
      created_at: member.tenants.created_at,
      updated_at: member.tenants.updated_at
    };

    return getAuthContext();
  } catch (error) {
    console.error("初始化認證失敗", error);
    currentUser = null;
    currentTenant = null;
    currentMember = null;
    return getAuthContext();
  } finally {
    isLoading = false;
  }
}

/**
 * 設定當前租戶（切換租戶時使用）
 */
export async function setCurrentTenant(tenantId: string): Promise<AuthContext> {
  if (!currentUser) {
    throw new Error("使用者未登入");
  }

  isLoading = true;
  try {
    const { data: member, error } = await supabaseClient
      .from("tenant_members")
      .select(`
        id, tenant_id, user_id, role, permissions, status, created_at,
        tenants!inner(id, name, plan_type, status, config, created_at, updated_at)
      `)
      .eq("user_id", currentUser.id)
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .single();

    if (error || !member) {
      throw new Error("無法載入租戶資訊");
    }

    const memberData = member as any;
    currentMember = {
      id: memberData.id,
      tenant_id: memberData.tenant_id,
      user_id: memberData.user_id,
      role: memberData.role,
      permissions: memberData.permissions,
      status: memberData.status,
      created_at: memberData.created_at
    };

    currentTenant = {
      id: memberData.tenants.id,
      name: memberData.tenants.name,
      plan_type: memberData.tenants.plan_type,
      status: memberData.tenants.status,
      config: memberData.tenants.config,
      created_at: memberData.tenants.created_at,
      updated_at: memberData.tenants.updated_at
    };

    return getAuthContext();
  } catch (error) {
    console.error("設定租戶失敗", error);
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * 清除認證狀態（登出時使用）
 */
export function clearAuth(): void {
  currentUser = null;
  currentTenant = null;
  currentMember = null;
  isLoading = false;
}

