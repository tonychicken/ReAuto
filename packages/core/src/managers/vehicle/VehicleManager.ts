import { supabaseClient } from "../../supabase/client";

export interface Vehicle {
  id: string;
  vin: string | null;
  plate_number: string | null;
  make: string;
  model: string;
  trim: string | null;
  year: number | null;
  color: string | null;
  mileage_km: number | null;
  fuel_type: string | null;
  transmission: string | null;
  status: string;
  cover_image_url: string | null;
  tags: string[];
  created_at: string;
}

export interface UpsertVehiclePayload {
  id?: string;
  vin?: string | null;
  plate_number?: string | null;
  make: string;
  model: string;
  trim?: string | null;
  year?: number | null;
  color?: string | null;
  mileage_km?: number | null;
  fuel_type?: string | null;
  transmission?: string | null;
  status?: string;
  cover_image_url?: string | null;
  tags?: string[];
}

export class VehicleManager {
  async list(): Promise<Vehicle[]> {
    const { data, error } = await supabaseClient
      .from("vehicles")
      .select(
        "id, vin, plate_number, make, model, trim, year, color, mileage_km, fuel_type, transmission, status, cover_image_url, tags, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Vehicle[];
  }

  async getById(id: string): Promise<Vehicle | null> {
    const { data, error } = await supabaseClient
      .from("vehicles")
      .select(
        "id, vin, plate_number, make, model, trim, year, color, mileage_km, fuel_type, transmission, status, cover_image_url, tags, created_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as Vehicle) ?? null;
  }

  async create(payload: UpsertVehiclePayload): Promise<Vehicle> {
    const { data, error } = await supabaseClient
      .from("vehicles")
      .insert({
        vin: payload.vin ?? null,
        plate_number: payload.plate_number ?? null,
        make: payload.make,
        model: payload.model,
        trim: payload.trim ?? null,
        year: payload.year ?? null,
        color: payload.color ?? null,
        mileage_km: payload.mileage_km ?? null,
        fuel_type: payload.fuel_type ?? null,
        transmission: payload.transmission ?? null,
        status: payload.status ?? "in_preparation",
        cover_image_url: payload.cover_image_url ?? null,
        tags: payload.tags ?? []
      })
      .select(
        "id, vin, plate_number, make, model, trim, year, color, mileage_km, fuel_type, transmission, status, cover_image_url, tags, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Vehicle;
  }

  async update(id: string, payload: UpsertVehiclePayload): Promise<Vehicle> {
    const { data, error } = await supabaseClient
      .from("vehicles")
      .update({
        vin: payload.vin ?? null,
        plate_number: payload.plate_number ?? null,
        make: payload.make,
        model: payload.model,
        trim: payload.trim ?? null,
        year: payload.year ?? null,
        color: payload.color ?? null,
        mileage_km: payload.mileage_km ?? null,
        fuel_type: payload.fuel_type ?? null,
        transmission: payload.transmission ?? null,
        status: payload.status ?? "in_preparation",
        cover_image_url: payload.cover_image_url ?? null,
        tags: payload.tags ?? []
      })
      .eq("id", id)
      .select(
        "id, vin, plate_number, make, model, trim, year, color, mileage_km, fuel_type, transmission, status, cover_image_url, tags, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Vehicle;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: string): Promise<Vehicle> {
    const { data, error } = await supabaseClient
      .from("vehicles")
      .update({ status })
      .eq("id", id)
      .select(
        "id, vin, plate_number, make, model, trim, year, color, mileage_km, fuel_type, transmission, status, cover_image_url, tags, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Vehicle;
  }
}

export const vehicleManager = new VehicleManager();

