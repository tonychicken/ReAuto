import { supabaseClient } from "../../supabase/client";
import { getCurrentTenantId } from "../../auth/context";

/**
 * InventoryManager
 * 負責「車輛庫存總攬」相關的讀取邏輯，之後再拆成更細的 service / store。
 * 目前先給出型別與骨架，方便 web / desktop / mobile 共用。
 */

export interface InventoryFilter {
  warehouseId?: string;
  status?: string;
  vehicleStatus?: string | string[]; // 車輛狀態（可多選）
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
}

export interface InventoryItem {
  id: string;
  vehicle_id: string;
  warehouse_id: string;
  location_code: string | null;
  status: string;
  stock_date: string;
  remark: string | null;
  created_at: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number | null;
    color: string | null;
    vin: string | null;
    plate_number: string | null;
    mileage_km: number | null;
    status: string;
    cover_image_url: string | null;
    tags: string[];
  };
  warehouse: {
    id: string;
    name: string;
    type: string | null;
  };
  // 關聯資料（join acquisitions 時使用）
  acquisition?: {
    purchase_price: number;
    purchase_date: string;
  };
}

export interface InventoryFilter {
  warehouseId?: string;
  status?: string;
  vehicleStatus?: string | string[]; // 車輛狀態（可多選）
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
}

export class InventoryManager {
  async listInventory(filter: InventoryFilter = {}): Promise<InventoryItem[]> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error("未選擇租戶");
    }

    // 建立查詢，join vehicles 和 warehouses
    let query = supabaseClient
      .from("vehicle_inventory")
      .select(`
        id, vehicle_id, warehouse_id, location_code, status, stock_date, remark, created_at,
        vehicles!inner(id, make, model, year, color, vin, plate_number, mileage_km, status, cover_image_url, tags),
        warehouses!inner(id, name, type)
      `)
      .eq("tenant_id", tenantId);

    if (filter.warehouseId) {
      query = query.eq("warehouse_id", filter.warehouseId);
    }

    if (filter.status) {
      query = query.eq("status", filter.status);
    }

    if (filter.vehicleStatus) {
      if (Array.isArray(filter.vehicleStatus)) {
        query = query.in("vehicles.status", filter.vehicleStatus);
      } else {
        query = query.eq("vehicles.status", filter.vehicleStatus);
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(100);

    if (error) {
      throw error;
    }

    // 轉換資料格式
    const items = (data ?? []).map((row: any) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      warehouse_id: row.warehouse_id,
      location_code: row.location_code,
      status: row.status,
      stock_date: row.stock_date,
      remark: row.remark,
      created_at: row.created_at,
      vehicle: row.vehicles,
      warehouse: row.warehouses
    })) as InventoryItem[];

    // 如果需要價格篩選，需要 join acquisitions
    if (filter.priceFrom || filter.priceTo) {
      const vehicleIds = items.map((item) => item.vehicle_id);
      const { data: acquisitions } = await supabaseClient
        .from("acquisitions")
        .select("vehicle_id, purchase_price, purchase_date")
        .in("vehicle_id", vehicleIds)
        .eq("tenant_id", tenantId);

      // 將收購資訊加入 items
      items.forEach((item) => {
        const acquisition = acquisitions?.find((a: any) => a.vehicle_id === item.vehicle_id);
        if (acquisition) {
          item.acquisition = {
            purchase_price: acquisition.purchase_price,
            purchase_date: acquisition.purchase_date
          };
        }
      });

      // 價格篩選
      return items.filter((item) => {
        if (!item.acquisition) return false;
        const price = item.acquisition.purchase_price;
        if (filter.priceFrom && price < filter.priceFrom) return false;
        if (filter.priceTo && price > filter.priceTo) return false;
        return true;
      });
    }

    return items;
  }
}

export const inventoryManager = new InventoryManager();


