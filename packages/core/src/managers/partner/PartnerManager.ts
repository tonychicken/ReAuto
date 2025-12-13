import { supabaseClient } from "../../supabase/client";

export interface Partner {
  id: string;
  name: string;
  type: string | null;
  tax_id: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  services: string[] | null; // JSONB 轉為 string[]
  avg_rating: number | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UpsertPartnerPayload {
  id?: string;
  name: string;
  type?: string | null;
  tax_id?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  address?: string | null;
  services?: string[] | null;
  avg_rating?: number | null;
  note?: string | null;
  is_active?: boolean;
}

export class PartnerManager {
  async list(): Promise<Partner[]> {
    const { data, error } = await supabaseClient
      .from("partners")
      .select(
        "id, name, type, tax_id, contact_name, contact_phone, contact_email, address, services, avg_rating, note, is_active, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      ...item,
      services: Array.isArray(item.services) ? item.services : item.services ? [item.services] : null
    })) as Partner[];
  }

  async create(payload: UpsertPartnerPayload): Promise<Partner> {
    const { data, error } = await supabaseClient
      .from("partners")
      .insert({
        name: payload.name,
        type: payload.type ?? null,
        tax_id: payload.tax_id ?? null,
        contact_name: payload.contact_name ?? null,
        contact_phone: payload.contact_phone ?? null,
        contact_email: payload.contact_email ?? null,
        address: payload.address ?? null,
        services: payload.services ?? null,
        avg_rating: payload.avg_rating ?? null,
        note: payload.note ?? null,
        is_active: payload.is_active ?? true
      })
      .select(
        "id, name, type, tax_id, contact_name, contact_phone, contact_email, address, services, avg_rating, note, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      services: Array.isArray(data.services) ? data.services : data.services ? [data.services] : null
    } as Partner;
  }

  async update(id: string, payload: UpsertPartnerPayload): Promise<Partner> {
    const { data, error } = await supabaseClient
      .from("partners")
      .update({
        name: payload.name,
        type: payload.type ?? null,
        tax_id: payload.tax_id ?? null,
        contact_name: payload.contact_name ?? null,
        contact_phone: payload.contact_phone ?? null,
        contact_email: payload.contact_email ?? null,
        address: payload.address ?? null,
        services: payload.services ?? null,
        avg_rating: payload.avg_rating ?? null,
        note: payload.note ?? null,
        is_active: payload.is_active ?? true
      })
      .eq("id", id)
      .select(
        "id, name, type, tax_id, contact_name, contact_phone, contact_email, address, services, avg_rating, note, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      services: Array.isArray(data.services) ? data.services : data.services ? [data.services] : null
    } as Partner;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("partners")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async setActive(id: string, isActive: boolean): Promise<Partner> {
    const { data, error } = await supabaseClient
      .from("partners")
      .update({ is_active: isActive })
      .eq("id", id)
      .select(
        "id, name, type, tax_id, contact_name, contact_phone, contact_email, address, services, avg_rating, note, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      services: Array.isArray(data.services) ? data.services : data.services ? [data.services] : null
    } as Partner;
  }
}

export const partnerManager = new PartnerManager();

