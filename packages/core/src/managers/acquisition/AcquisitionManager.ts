import { supabaseClient } from "../../supabase/client";
import { getCurrentTenantId, getCurrentUserId } from "../../auth/context";

export interface Acquisition {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  seller_contact_id: string | null;
  seller_type: string | null;
  source_partner_id: string | null;
  purchase_price: number;
  purchase_date: string;
  estimated_repair_cost: number | null;
  other_costs: Record<string, any> | null;
  purchasing_staff_id: string | null;
  status: "draft" | "submitted" | "approved" | "rejected";
  approved_by: string | null;
  approved_at: string | null;
  rejected_reason: string | null;
  note: string | null;
  created_at: string;
}

export interface UpsertAcquisitionPayload {
  id?: string;
  vehicle_id: string;
  seller_contact_id?: string | null;
  seller_type?: string | null;
  source_partner_id?: string | null;
  purchase_price: number;
  purchase_date?: string;
  estimated_repair_cost?: number | null;
  other_costs?: Record<string, any> | null;
  purchasing_staff_id?: string | null;
  status?: "draft" | "submitted" | "approved" | "rejected";
  approved_by?: string | null;
  approved_at?: string | null;
  rejected_reason?: string | null;
  note?: string | null;
}

export class AcquisitionManager {
  async getByVehicleId(vehicleId: string): Promise<Acquisition | null> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("acquisitions")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data as Acquisition;
  }

  async create(payload: UpsertAcquisitionPayload): Promise<Acquisition> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("使用者未登入");
    }

    // 先取得 tenant_member id
    const { data: member } = await supabaseClient
      .from("tenant_members")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    const { data, error } = await supabaseClient
      .from("acquisitions")
      .insert({
        tenant_id: tenantId,
        vehicle_id: payload.vehicle_id,
        seller_contact_id: payload.seller_contact_id ?? null,
        seller_type: payload.seller_type ?? null,
        source_partner_id: payload.source_partner_id ?? null,
        purchase_price: payload.purchase_price,
        purchase_date: payload.purchase_date ?? new Date().toISOString().split("T")[0],
        estimated_repair_cost: payload.estimated_repair_cost ?? null,
        other_costs: payload.other_costs ?? null,
        purchasing_staff_id: member?.id ?? null,
        status: payload.status ?? "draft",
        approved_by: payload.approved_by ?? null,
        approved_at: payload.approved_at ?? null,
        rejected_reason: payload.rejected_reason ?? null,
        note: payload.note ?? null
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Acquisition;
  }

  async update(id: string, payload: UpsertAcquisitionPayload): Promise<Acquisition> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("acquisitions")
      .update({
        seller_contact_id: payload.seller_contact_id ?? null,
        seller_type: payload.seller_type ?? null,
        source_partner_id: payload.source_partner_id ?? null,
        purchase_price: payload.purchase_price,
        purchase_date: payload.purchase_date ?? undefined,
        estimated_repair_cost: payload.estimated_repair_cost ?? null,
        other_costs: payload.other_costs ?? null,
        status: payload.status ?? undefined,
        approved_by: payload.approved_by ?? undefined,
        approved_at: payload.approved_at ?? undefined,
        rejected_reason: payload.rejected_reason ?? undefined,
        note: payload.note ?? null
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Acquisition;
  }

  async delete(id: string): Promise<void> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { error } = await supabaseClient
      .from("acquisitions")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);

    if (error) {
      throw error;
    }
  }

  /**
   * 更新收購狀態（送審 / 審核通過 / 退回）
   */
  async updateStatus(
    id: string,
    status: "draft" | "submitted" | "approved" | "rejected",
    options?: { rejected_reason?: string | null }
  ): Promise<Acquisition> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    let approvedBy: string | null | undefined = undefined;
    let approvedAt: string | null | undefined = undefined;
    let rejectedReason: string | null | undefined = undefined;

    if (status === "approved") {
      // 取得目前使用者對應的 tenant_member.id 作為 approved_by
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("使用者未登入");
      }

      const { data: member } = await supabaseClient
        .from("tenant_members")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      approvedBy = member?.id ?? null;
      approvedAt = new Date().toISOString();
      rejectedReason = null;
    } else if (status === "rejected") {
      approvedBy = null;
      approvedAt = null;
      rejectedReason = options?.rejected_reason ?? null;
    } else {
      // draft / submitted：清掉審核資訊
      approvedBy = null;
      approvedAt = null;
      rejectedReason = null;
    }

    const { data, error } = await supabaseClient
      .from("acquisitions")
      .update({
        status,
        approved_by: approvedBy,
        approved_at: approvedAt,
        rejected_reason: rejectedReason
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Acquisition;
  }
}

export const acquisitionManager = new AcquisitionManager();

