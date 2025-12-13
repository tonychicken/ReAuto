import { supabaseClient } from "../../supabase/client";
import { getCurrentTenantId } from "../../auth/context";

export interface Contact {
  id: string;
  tenant_id: string;
  type: string;
  name: string;
  phone: string | null;
  email: string | null;
  id_number_hash: string | null;
  address: string | null;
  note: string | null;
  created_at: string;
}

export interface UpsertContactPayload {
  id?: string;
  type: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  id_number_hash?: string | null;
  address?: string | null;
  note?: string | null;
}

export class ContactManager {
  async list(): Promise<Contact[]> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Contact[];
  }

  async getById(id: string): Promise<Contact | null> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("contacts")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data as Contact;
  }

  async create(payload: UpsertContactPayload): Promise<Contact> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("contacts")
      .insert({
        tenant_id: tenantId,
        type: payload.type,
        name: payload.name,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        id_number_hash: payload.id_number_hash ?? null,
        address: payload.address ?? null,
        note: payload.note ?? null
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Contact;
  }

  async update(id: string, payload: UpsertContactPayload): Promise<Contact> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { data, error } = await supabaseClient
      .from("contacts")
      .update({
        type: payload.type,
        name: payload.name,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        id_number_hash: payload.id_number_hash ?? null,
        address: payload.address ?? null,
        note: payload.note ?? null
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Contact;
  }

  async delete(id: string): Promise<void> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    const { error } = await supabaseClient
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("tenant_id", tenantId);

    if (error) {
      throw error;
    }
  }
}

export const contactManager = new ContactManager();

