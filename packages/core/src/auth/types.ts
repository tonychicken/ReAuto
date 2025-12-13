/**
 * 認證與多租戶相關的型別定義
 */

export type UserRole = "owner" | "manager" | "staff" | "viewer";

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  plan_type: "free" | "standard" | "pro";
  status: "active" | "suspended";
  config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  permissions: Record<string, any> | null;
  status: "active" | "invited" | "disabled";
  created_at: string;
}

export interface AuthContext {
  user: User | null;
  tenant: Tenant | null;
  member: TenantMember | null;
  loading: boolean;
}

export interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  execute: boolean;
}

