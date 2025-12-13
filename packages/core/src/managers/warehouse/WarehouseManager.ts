import { supabaseClient } from "../../supabase/client";

export interface Warehouse {
  id: string;
  name: string;
  type: string | null;
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UpsertWarehousePayload {
  id?: string;
  name: string;
  type?: string | null;
  address?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  is_active?: boolean;
}

export class WarehouseManager {
  async list(): Promise<Warehouse[]> {
    const { data, error } = await supabaseClient
      .from("warehouses")
      .select(
        "id, name, type, address, contact_name, contact_phone, is_active, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Warehouse[];
  }

  async create(payload: UpsertWarehousePayload): Promise<Warehouse> {
    const { data, error } = await supabaseClient
      .from("warehouses")
      .insert({
        name: payload.name,
        type: payload.type ?? "internal",
        address: payload.address ?? null,
        contact_name: payload.contact_name ?? null,
        contact_phone: payload.contact_phone ?? null,
        is_active: payload.is_active ?? true
      })
      .select(
        "id, name, type, address, contact_name, contact_phone, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Warehouse;
  }

  async update(id: string, payload: UpsertWarehousePayload): Promise<Warehouse> {
    const { data, error } = await supabaseClient
      .from("warehouses")
      .update({
        name: payload.name,
        type: payload.type ?? "internal",
        address: payload.address ?? null,
        contact_name: payload.contact_name ?? null,
        contact_phone: payload.contact_phone ?? null,
        is_active: payload.is_active ?? true
      })
      .eq("id", id)
      .select(
        "id, name, type, address, contact_name, contact_phone, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Warehouse;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("warehouses")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async setActive(id: string, isActive: boolean): Promise<Warehouse> {
    const { data, error } = await supabaseClient
      .from("warehouses")
      .update({ is_active: isActive })
      .eq("id", id)
      .select(
        "id, name, type, address, contact_name, contact_phone, is_active, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Warehouse;
  }
}

export const warehouseManager = new WarehouseManager();

