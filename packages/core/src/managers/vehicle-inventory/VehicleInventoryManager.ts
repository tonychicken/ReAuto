import { supabaseClient } from "../../supabase/client";

export interface VehicleInventory {
  id: string;
  vehicle_id: string;
  warehouse_id: string;
  location_code: string | null;
  status: string;
  stock_date: string;
  remark: string | null;
  created_at: string;
  // 關聯資料（join 時使用）
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number | null;
    color: string | null;
    vin: string | null;
    plate_number: string | null;
  };
  warehouse?: {
    id: string;
    name: string;
    type: string | null;
  };
}

export interface UpsertVehicleInventoryPayload {
  id?: string;
  vehicle_id: string;
  warehouse_id: string;
  location_code?: string | null;
  status?: string;
  stock_date?: string;
  remark?: string | null;
}

export class VehicleInventoryManager {
  /**
   * 查詢某個倉庫的所有車輛
   */
  async listByWarehouse(warehouseId: string): Promise<VehicleInventory[]> {
    const { data, error } = await supabaseClient
      .from("vehicle_inventory")
      .select(
        `
        id, vehicle_id, warehouse_id, location_code, status, stock_date, remark, created_at,
        vehicles!inner(id, make, model, year, color, vin, plate_number),
        warehouses!inner(id, name, type)
        `
      )
      .eq("warehouse_id", warehouseId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      vehicle_id: item.vehicle_id,
      warehouse_id: item.warehouse_id,
      location_code: item.location_code,
      status: item.status,
      stock_date: item.stock_date,
      remark: item.remark,
      created_at: item.created_at,
      vehicle: item.vehicles,
      warehouse: item.warehouses
    })) as VehicleInventory[];
  }

  /**
   * 查詢某台車輛所在的倉庫
   */
  async listByVehicle(vehicleId: string): Promise<VehicleInventory[]> {
    const { data, error } = await supabaseClient
      .from("vehicle_inventory")
      .select(
        `
        id, vehicle_id, warehouse_id, location_code, status, stock_date, remark, created_at,
        vehicles!inner(id, make, model, year, color, vin, plate_number),
        warehouses!inner(id, name, type)
        `
      )
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      vehicle_id: item.vehicle_id,
      warehouse_id: item.warehouse_id,
      location_code: item.location_code,
      status: item.status,
      stock_date: item.stock_date,
      remark: item.remark,
      created_at: item.created_at,
      vehicle: item.vehicles,
      warehouse: item.warehouses
    })) as VehicleInventory[];
  }

  /**
   * 新增庫存記錄（將車輛加入倉庫）
   */
  async create(payload: UpsertVehicleInventoryPayload): Promise<VehicleInventory> {
    const { data, error } = await supabaseClient
      .from("vehicle_inventory")
      .insert({
        vehicle_id: payload.vehicle_id,
        warehouse_id: payload.warehouse_id,
        location_code: payload.location_code ?? null,
        status: payload.status ?? "in_stock",
        stock_date: payload.stock_date ?? new Date().toISOString().split("T")[0],
        remark: payload.remark ?? null
      })
      .select(
        "id, vehicle_id, warehouse_id, location_code, status, stock_date, remark, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as VehicleInventory;
  }

  /**
   * 更新庫存記錄
   */
  async update(id: string, payload: UpsertVehicleInventoryPayload): Promise<VehicleInventory> {
    const { data, error } = await supabaseClient
      .from("vehicle_inventory")
      .update({
        warehouse_id: payload.warehouse_id,
        location_code: payload.location_code ?? null,
        status: payload.status ?? "in_stock",
        stock_date: payload.stock_date,
        remark: payload.remark ?? null
      })
      .eq("id", id)
      .select(
        "id, vehicle_id, warehouse_id, location_code, status, stock_date, remark, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return data as VehicleInventory;
  }

  /**
   * 刪除庫存記錄（將車輛移出倉庫）
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("vehicle_inventory")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const vehicleInventoryManager = new VehicleInventoryManager();

