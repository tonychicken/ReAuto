import { supabaseClient } from "../../supabase/client";

export interface ServiceQuote {
  id: string;
  partner_id: string;
  vehicle_id: string;
  service_name: string;
  quoted_price: number;
  currency: string;
  quote_date: string;
  status: string; // pending / accepted / rejected / in_progress / completed
  note: string | null;
  created_at: string;
  updated_at: string;
  // 關聯資料（join 時使用）
  partner?: {
    id: string;
    name: string;
    type: string | null;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number | null;
    vin: string | null;
    plate_number: string | null;
  };
}

export interface UpsertServiceQuotePayload {
  id?: string;
  partner_id: string;
  vehicle_id: string;
  service_name: string;
  quoted_price: number;
  currency?: string;
  quote_date?: string;
  status?: string;
  note?: string | null;
}

export class ServiceQuoteManager {
  /**
   * 查詢某個維修廠的所有車輛（正在服務中的）
   */
  async listByPartner(partnerId: string, status?: string): Promise<ServiceQuote[]> {
    let query = supabaseClient
      .from("service_quotes")
      .select(
        `
        id, partner_id, vehicle_id, service_name, quoted_price, currency, quote_date, status, note, created_at, updated_at,
        partners!inner(id, name, type),
        vehicles!inner(id, make, model, year, vin, plate_number)
        `
      )
      .eq("partner_id", partnerId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      partner_id: item.partner_id,
      vehicle_id: item.vehicle_id,
      service_name: item.service_name,
      quoted_price: item.quoted_price,
      currency: item.currency,
      quote_date: item.quote_date,
      status: item.status,
      note: item.note,
      created_at: item.created_at,
      updated_at: item.updated_at,
      partner: item.partners,
      vehicle: item.vehicles
    })) as ServiceQuote[];
  }

  /**
   * 查詢某台車輛的所有服務記錄
   */
  async listByVehicle(vehicleId: string): Promise<ServiceQuote[]> {
    const { data, error } = await supabaseClient
      .from("service_quotes")
      .select(
        `
        id, partner_id, vehicle_id, service_name, quoted_price, currency, quote_date, status, note, created_at, updated_at,
        partners!inner(id, name, type),
        vehicles!inner(id, make, model, year, vin, plate_number)
        `
      )
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      partner_id: item.partner_id,
      vehicle_id: item.vehicle_id,
      service_name: item.service_name,
      quoted_price: item.quoted_price,
      currency: item.currency,
      quote_date: item.quote_date,
      status: item.status,
      note: item.note,
      created_at: item.created_at,
      updated_at: item.updated_at,
      partner: item.partners,
      vehicle: item.vehicles
    })) as ServiceQuote[];
  }

  /**
   * 新增服務報價（送美容、送維修）
   */
  async create(payload: UpsertServiceQuotePayload): Promise<ServiceQuote> {
    const { data, error } = await supabaseClient
      .from("service_quotes")
      .insert({
        partner_id: payload.partner_id,
        vehicle_id: payload.vehicle_id,
        service_name: payload.service_name,
        quoted_price: payload.quoted_price,
        currency: payload.currency ?? "TWD",
        quote_date: payload.quote_date ?? new Date().toISOString().split("T")[0],
        status: payload.status ?? "pending",
        note: payload.note ?? null
      })
      .select(
        "id, partner_id, vehicle_id, service_name, quoted_price, currency, quote_date, status, note, created_at, updated_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as ServiceQuote;
  }

  /**
   * 更新服務報價狀態（例如：接受報價、開始服務、完成服務）
   */
  async updateStatus(id: string, status: string): Promise<ServiceQuote> {
    const { data, error } = await supabaseClient
      .from("service_quotes")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select(
        "id, partner_id, vehicle_id, service_name, quoted_price, currency, quote_date, status, note, created_at, updated_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as ServiceQuote;
  }

  /**
   * 刪除服務報價
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("service_quotes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const serviceQuoteManager = new ServiceQuoteManager();

