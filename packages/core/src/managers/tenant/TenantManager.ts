import { supabaseClient } from "../../supabase/client";
import type { Tenant } from "../../auth/types";

export interface UpsertTenantPayload {
  id?: string;
  name: string;
  plan_type?: "free" | "standard" | "pro";
  status?: "active" | "suspended";
  config?: Record<string, any> | null;
}

export class TenantManager {
  async list(): Promise<Tenant[]> {
    const { data, error } = await supabaseClient
      .from("tenants")
      .select("id, name, plan_type, status, config, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Tenant[];
  }

  async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabaseClient
      .from("tenants")
      .select("id, name, plan_type, status, config, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // 找不到記錄
      }
      throw error;
    }

    return data as Tenant;
  }

  async create(payload: UpsertTenantPayload): Promise<Tenant> {
    const { data, error } = await supabaseClient
      .from("tenants")
      .insert({
        name: payload.name,
        plan_type: payload.plan_type ?? "free",
        status: payload.status ?? "active",
        config: payload.config ?? null
      })
      .select("id, name, plan_type, status, config, created_at, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return data as Tenant;
  }

  async update(id: string, payload: UpsertTenantPayload): Promise<Tenant> {
    const { data, error } = await supabaseClient
      .from("tenants")
      .update({
        name: payload.name,
        plan_type: payload.plan_type,
        status: payload.status,
        config: payload.config,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("id, name, plan_type, status, config, created_at, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return data as Tenant;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("tenants")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const tenantManager = new TenantManager();

