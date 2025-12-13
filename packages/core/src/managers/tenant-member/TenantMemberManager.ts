import { supabaseClient } from "../../supabase/client";
import type { TenantMember, UserRole } from "../../auth/types";

export interface UpsertTenantMemberPayload {
  id?: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  permissions?: Record<string, any> | null;
  status?: "active" | "invited" | "disabled";
}

export interface InviteMemberPayload {
  tenant_id: string;
  email: string;
  role: UserRole;
  permissions?: Record<string, any> | null;
}

export class TenantMemberManager {
  /**
   * 列出某個租戶的所有成員
   */
  async listByTenant(tenantId: string): Promise<TenantMember[]> {
    const { data, error } = await supabaseClient
      .from("tenant_members")
      .select(`
        id, tenant_id, user_id, role, permissions, status, created_at,
        profiles!inner(id, display_name, email, phone, avatar_url)
      `)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      tenant_id: item.tenant_id,
      user_id: item.user_id,
      role: item.role,
      permissions: item.permissions,
      status: item.status,
      created_at: item.created_at
    })) as TenantMember[];
  }

  /**
   * 列出某個使用者的所有租戶成員身份
   */
  async listByUser(userId: string): Promise<TenantMember[]> {
    const { data, error } = await supabaseClient
      .from("tenant_members")
      .select("id, tenant_id, user_id, role, permissions, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as TenantMember[];
  }

  /**
   * 新增成員（直接指定 user_id）
   */
  async create(payload: UpsertTenantMemberPayload): Promise<TenantMember> {
    const { data, error } = await supabaseClient
      .from("tenant_members")
      .insert({
        tenant_id: payload.tenant_id,
        user_id: payload.user_id,
        role: payload.role,
        permissions: payload.permissions ?? null,
        status: payload.status ?? "active"
      })
      .select("id, tenant_id, user_id, role, permissions, status, created_at")
      .single();

    if (error) {
      throw error;
    }

    return data as TenantMember;
  }

  /**
   * 邀請成員（透過 email，需要先建立或找到對應的 user）
   */
  async invite(payload: InviteMemberPayload): Promise<TenantMember> {
    // 先檢查 email 是否已存在於 auth.users
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
    let targetUserId: string | null = null;

    const existingUser = existingUsers?.users?.find((u) => u.email === payload.email);
    if (existingUser) {
      targetUserId = existingUser.id;
    } else {
      // 如果不存在，需要建立新使用者（這裡簡化處理，實際應該發送邀請郵件）
      // 暫時先建立一個 invited 狀態的成員記錄
      // 實際應用中應該使用 Supabase 的邀請功能
      throw new Error("邀請功能需要實作 Supabase 的邀請流程");
    }

    return this.create({
      tenant_id: payload.tenant_id,
      user_id: targetUserId,
      role: payload.role,
      permissions: payload.permissions ?? null,
      status: "invited"
    });
  }

  /**
   * 更新成員資訊
   */
  async update(id: string, payload: Partial<UpsertTenantMemberPayload>): Promise<TenantMember> {
    const updateData: any = {};
    if (payload.role !== undefined) updateData.role = payload.role;
    if (payload.permissions !== undefined) updateData.permissions = payload.permissions;
    if (payload.status !== undefined) updateData.status = payload.status;

    const { data, error } = await supabaseClient
      .from("tenant_members")
      .update(updateData)
      .eq("id", id)
      .select("id, tenant_id, user_id, role, permissions, status, created_at")
      .single();

    if (error) {
      throw error;
    }

    return data as TenantMember;
  }

  /**
   * 更新成員角色
   */
  async updateRole(id: string, role: UserRole): Promise<TenantMember> {
    return this.update(id, { role });
  }

  /**
   * 更新成員狀態
   */
  async updateStatus(id: string, status: "active" | "invited" | "disabled"): Promise<TenantMember> {
    return this.update(id, { status });
  }

  /**
   * 移除成員
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("tenant_members")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const tenantMemberManager = new TenantMemberManager();

