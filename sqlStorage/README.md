# SQL Schema 檔案說明

## 📋 檔案結構

### `00_complete_schema.sql` ⭐ **主要檔案**
完整的資料庫 Schema，包含所有資料表的完整定義。建議使用此檔案來建立資料庫結構。

**包含的資料表：**
- **多租戶與帳號**：`tenants`, `profiles`, `tenant_members`
- **倉庫與服務廠**：`warehouses`, `partners`, `service_quotes`
- **車輛相關**：`vehicles`, `vehicle_details`, `vehicle_inventory`
- **收購與銷售**：`contacts`, `acquisitions`, `sales`
- **上架功能**：`listings`

**特色：**
- 所有 CREATE TABLE 語句都使用 `IF NOT EXISTS`，可安全重複執行
- 包含完整的索引定義，提升查詢效能
- 所有欄位都有中文註解說明
- 包含外鍵約束和級聯刪除設定
- 支援多租戶架構（所有表都有 `tenant_id` 欄位）

### 歷史檔案（已整合）

以下檔案已整合到 `00_complete_schema.sql`，保留作為歷史記錄：

- `001_init_core_tables.sql` - 初始核心表（warehouses, vehicles, vehicle_inventory, partners）
- `002_alter_warehouses_add_fields.sql` - 擴充 warehouses 欄位
- `003_add_tenant_id_to_warehouses.sql` - 加入 tenant_id 到 warehouses
- `004_add_tenant_id_to_partners.sql` - 加入 tenant_id 到 partners
- `005_add_tenant_id_to_vehicles.sql` - 加入 tenant_id 到 vehicles
- `006_complete_vehicle_inventory.sql` - 完善 vehicle_inventory 表
- `007_create_service_quotes.sql` - 建立 service_quotes 表
- `008_create_vehicle_details.sql` - 建立 vehicle_details 表

## 🚀 使用方式

### 在 Supabase 中執行

1. 開啟 Supabase Dashboard
2. 進入 SQL Editor
3. 複製 `00_complete_schema.sql` 的**完整內容**（Ctrl+A 全選，Ctrl+C 複製）
4. 貼上並執行（點擊 Run 按鈕）

### 注意事項

- **必須從頭到尾執行整個檔案**，不要只執行部分內容
- 所有資料表都使用 `IF NOT EXISTS`，可安全重複執行
- `tenant_id` 欄位目前設為可為 null，之後實作多租戶時再補上
- 建議在執行前先備份現有資料（如果有的話）

## 📝 資料表清單

| 資料表 | 說明 | 狀態 |
|--------|------|------|
| `tenants` | 租戶（企業會員） | ✅ |
| `profiles` | 使用者資料 | ✅ |
| `tenant_members` | 租戶成員 | ✅ |
| `warehouses` | 倉庫 | ✅ |
| `partners` | 維修/服務廠商 | ✅ |
| `service_quotes` | 服務報價 | ✅ |
| `vehicles` | 車輛主檔 | ✅ |
| `vehicle_details` | 車輛細節 | ✅ |
| `vehicle_inventory` | 庫存記錄 | ✅ |
| `contacts` | 聯絡人 | ✅ |
| `acquisitions` | 收購資訊 | ✅ |
| `sales` | 賣出資訊 | ✅ |
| `listings` | 上架紀錄 | ✅ |

## 🔄 未來擴充

當需要新增或修改資料表時：
1. 更新 `00_complete_schema.sql`
2. 如需保留 migration 記錄，可新增 `XXX_migration_name.sql` 檔案
3. 更新此 README 說明變更內容

## 🔐 權限與 RLS

目前 SQL 檔案只建立資料表結構，**尚未實作 Row Level Security (RLS)**。

未來需要實作 RLS 策略來確保：
- 每個租戶只能存取自己的資料
- 不同角色（owner/manager/staff/viewer）有不同的權限
- 敏感資料（如成本、客戶資訊）僅授權角色可查看

