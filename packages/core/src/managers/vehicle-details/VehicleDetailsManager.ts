import { supabaseClient } from "../../supabase/client";
import { getCurrentTenantId } from "../../auth/context";

export interface VehicleDetails {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  has_detailing: boolean;
  detailing_date: string | null;
  detailing_partner_id: string | null;
  detailing_images: string[] | null;
  has_certification: boolean;
  certification_date: string | null;
  certification_provider: string | null;
  certification_images: string[] | null;
  has_transfer_done: boolean;
  transfer_documents: string[] | null;
  keys_count: number | null;
  has_tax_certificate: boolean;
  tax_certificate_images: string[] | null;
  has_origin_certificate: boolean;
  origin_certificate_images: string[] | null;
  condition_grade: string | null;
  condition_notes: string | null;
  equipment: Record<string, any> | null;
  repair_history: any[] | null;
  expected_repair_cost: number | null;
  status_tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertVehicleDetailsPayload {
  id?: string;
  vehicle_id: string;
  has_detailing?: boolean;
  detailing_date?: string | null;
  detailing_partner_id?: string | null;
  detailing_images?: string[] | null;
  has_certification?: boolean;
  certification_date?: string | null;
  certification_provider?: string | null;
  certification_images?: string[] | null;
  has_transfer_done?: boolean;
  transfer_documents?: string[] | null;
  keys_count?: number | null;
  has_tax_certificate?: boolean;
  tax_certificate_images?: string[] | null;
  has_origin_certificate?: boolean;
  origin_certificate_images?: string[] | null;
  condition_grade?: string | null;
  condition_notes?: string | null;
  equipment?: Record<string, any> | null;
  repair_history?: any[] | null;
  expected_repair_cost?: number | null;
  status_tags?: string[] | null;
}

export class VehicleDetailsManager {
  async getByVehicleId(vehicleId: string): Promise<VehicleDetails | null> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("vehicle_details")
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

    return data as VehicleDetails;
  }

  async create(payload: UpsertVehicleDetailsPayload): Promise<VehicleDetails> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("vehicle_details")
      .insert({
        tenant_id: tenantId,
        vehicle_id: payload.vehicle_id,
        has_detailing: payload.has_detailing ?? false,
        detailing_date: payload.detailing_date ?? null,
        detailing_partner_id: payload.detailing_partner_id ?? null,
        detailing_images: payload.detailing_images ?? null,
        has_certification: payload.has_certification ?? false,
        certification_date: payload.certification_date ?? null,
        certification_provider: payload.certification_provider ?? null,
        certification_images: payload.certification_images ?? null,
        has_transfer_done: payload.has_transfer_done ?? false,
        transfer_documents: payload.transfer_documents ?? null,
        keys_count: payload.keys_count ?? null,
        has_tax_certificate: payload.has_tax_certificate ?? false,
        tax_certificate_images: payload.tax_certificate_images ?? null,
        has_origin_certificate: payload.has_origin_certificate ?? false,
        origin_certificate_images: payload.origin_certificate_images ?? null,
        condition_grade: payload.condition_grade ?? null,
        condition_notes: payload.condition_notes ?? null,
        equipment: payload.equipment ?? null,
        repair_history: payload.repair_history ?? null,
        expected_repair_cost: payload.expected_repair_cost ?? null,
        status_tags: payload.status_tags ?? null
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as VehicleDetails;
  }

  async update(id: string, payload: UpsertVehicleDetailsPayload): Promise<VehicleDetails> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const updateData: any = {};
    if (payload.has_detailing !== undefined) updateData.has_detailing = payload.has_detailing;
    if (payload.detailing_date !== undefined) updateData.detailing_date = payload.detailing_date;
    if (payload.detailing_partner_id !== undefined) updateData.detailing_partner_id = payload.detailing_partner_id;
    if (payload.detailing_images !== undefined) updateData.detailing_images = payload.detailing_images;
    if (payload.has_certification !== undefined) updateData.has_certification = payload.has_certification;
    if (payload.certification_date !== undefined) updateData.certification_date = payload.certification_date;
    if (payload.certification_provider !== undefined) updateData.certification_provider = payload.certification_provider;
    if (payload.certification_images !== undefined) updateData.certification_images = payload.certification_images;
    if (payload.has_transfer_done !== undefined) updateData.has_transfer_done = payload.has_transfer_done;
    if (payload.transfer_documents !== undefined) updateData.transfer_documents = payload.transfer_documents;
    if (payload.keys_count !== undefined) updateData.keys_count = payload.keys_count;
    if (payload.has_tax_certificate !== undefined) updateData.has_tax_certificate = payload.has_tax_certificate;
    if (payload.tax_certificate_images !== undefined) updateData.tax_certificate_images = payload.tax_certificate_images;
    if (payload.has_origin_certificate !== undefined) updateData.has_origin_certificate = payload.has_origin_certificate;
    if (payload.origin_certificate_images !== undefined) updateData.origin_certificate_images = payload.origin_certificate_images;
    if (payload.condition_grade !== undefined) updateData.condition_grade = payload.condition_grade;
    if (payload.condition_notes !== undefined) updateData.condition_notes = payload.condition_notes;
    if (payload.equipment !== undefined) updateData.equipment = payload.equipment;
    if (payload.repair_history !== undefined) updateData.repair_history = payload.repair_history;
    if (payload.expected_repair_cost !== undefined) updateData.expected_repair_cost = payload.expected_repair_cost;
    if (payload.status_tags !== undefined) updateData.status_tags = payload.status_tags;

    const { data, error } = await supabaseClient
      .from("vehicle_details")
      .update(updateData)
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as VehicleDetails;
  }
}

export const vehicleDetailsManager = new VehicleDetailsManager();

