-- ============================================================================
-- 完整資料庫 Schema
-- ============================================================================
-- 說明：此檔案包含所有資料表的完整定義，用於開發階段建立資料庫結構
-- 所有 CREATE TABLE 語句都使用 IF NOT EXISTS，可安全重複執行
-- 
-- ⚠️ 執行方式（Supabase SQL Editor）：
-- 1. 複製「整個檔案」的內容（Ctrl+A 全選，Ctrl+C 複製）
-- 2. 在 Supabase SQL Editor 中貼上（Ctrl+V）
-- 3. 點擊「Run」按鈕執行整個檔案
-- 4. 不要只選取部分內容執行，因為資料表之間有外鍵依賴關係
-- 
-- ✅ 此檔案可以完整執行，所有語句都已正確分隔（用分號）
-- ============================================================================

-- ============================================================================
-- 1. 多租戶與帳號結構
-- ============================================================================

-- 租戶表（企業會員）
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,                    -- 公司/組織名稱
  plan_type text default 'free',         -- 方案類型：free / standard / pro
  status text default 'active',          -- 租戶狀態：active / suspended
  config jsonb,                          -- 未來擴充各種設定（顯示欄位、貨幣、稅率…）
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 使用者資料表（對應 auth.users）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,                     -- 顯示名稱
  phone text,                             -- 聯絡電話
  avatar_url text,                        -- 頭像圖片網址
  created_at timestamptz default now()
);

-- 租戶成員表
create table if not exists public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,                    -- 基礎角色：owner / manager / staff / viewer
  permissions jsonb,                     -- 個人自訂覆蓋預設權限
  status text default 'active',         -- 成員狀態：active / invited / disabled
  created_at timestamptz default now(),
  unique(tenant_id, user_id)
);

-- 組織表（客戶內部的組織單位，例如：台北分公司、台中據點）
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,                    -- 組織名稱（例如：台北分公司、台中據點）
  parent_id uuid references public.organizations(id) on delete set null, -- 支援階層結構（總公司 → 分公司）
  type text default 'branch',            -- 組織類型：headquarters / branch / department
  is_active boolean default true,         -- 是否啟用
  created_at timestamptz default now(),
  created_by uuid references public.tenant_members(id) on delete set null, -- 建立人
  updated_at timestamptz default now()
);

-- 部門表（組織下的部門，例如：業務部、倉儲部）
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade, -- 所屬組織（可選）
  name text not null,                    -- 部門名稱（例如：業務部、倉儲部）
  code text,                             -- 部門代碼（例如：SALES-001）
  is_active boolean default true,         -- 是否啟用
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 自訂角色表（客戶可以自己定義角色，基於預設角色擴展）
create table if not exists public.custom_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,                    -- 角色名稱（例如：業務主管、倉管員）
  base_role text not null,               -- 基礎角色：owner / manager / staff / viewer
  permissions jsonb,                     -- 自訂權限覆蓋（覆蓋 base_role 的預設權限）
  description text,                      -- 角色說明
  is_system boolean default false,        -- 是否為系統預設角色（不可刪除）
  created_at timestamptz default now(),
  created_by uuid references public.tenant_members(id) on delete set null, -- 建立人
  updated_at timestamptz default now()
);

-- 修改 tenant_members，增加組織和部門關聯
alter table public.tenant_members add column if not exists organization_id uuid references public.organizations(id) on delete set null;
alter table public.tenant_members add column if not exists department_id uuid references public.departments(id) on delete set null;
alter table public.tenant_members add column if not exists custom_role_id uuid references public.custom_roles(id) on delete set null;

-- ============================================================================
-- 2. 倉庫與維修/服務廠商
-- ============================================================================

-- 倉庫表
create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  name text not null,                    -- 倉庫名稱
  type text default 'internal',          -- 倉庫類型：internal / partner / showroom
  address text,                          -- 地址
  contact_name text,                     -- 聯絡人姓名
  contact_phone text,                    -- 聯絡電話
  is_active boolean default true,         -- 是否啟用
  created_at timestamptz default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  name text not null,                    -- 店家名稱
  type text,                             -- 類型：repair_shop / detailing / inspection / tire / other
  tax_id text,                           -- 統編
  contact_name text,                     -- 聯絡人姓名
  contact_phone text,                    -- 聯絡電話
  contact_email text,                    -- 聯絡 Email
  address text,                          -- 地址
  services jsonb,                        -- 店家主打服務清單（如：小保養、大保養、烤漆一片…）
  avg_rating numeric,                    -- 平均評分（之後可用來記錄內部評價）
  note text,                             -- 備註
  is_active boolean default true,        -- 是否啟用
  created_at timestamptz default now()
);

-- ============================================================================
-- 3. 車輛、庫存與車輛資訊
-- ============================================================================

-- 車輛主檔
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vin text,                             -- 車身號
  plate_number text,                    -- 車牌
  make text not null,                   -- 廠牌
  model text not null,                  -- 車系
  trim text,                            -- 車型/等級
  year smallint,                        -- 年份
  color text,                           -- 顏色
  mileage_km integer,                   -- 目前里程
  fuel_type text,                       -- 燃料類型：petrol / diesel / hybrid / ev / other
  transmission text,                    -- 變速箱：at / mt / cvt / other
  status text default 'in_preparation', -- 車輛狀態：draft / in_preparation / ready_for_sale / listed / reserved / sold / scrapped
  cover_image_url text,                 -- 封面圖片網址
  tags text[],                          -- 標籤（例如：事故車 / 熱門款 / 認證車）
  created_at timestamptz default now(),
  created_by uuid references public.tenant_members(id) on delete set null  -- 建立人（成員 ID）
);

-- 車輛細節表（美容 / 認證 / 過戶 / 文件）
create table if not exists public.vehicle_details (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vehicle_id uuid not null unique references public.vehicles(id) on delete cascade,  -- 對應車輛 ID（唯一）
  has_detailing boolean default false,  -- 美容完成
  detailing_date date,                  -- 美容完成日期
  detailing_partner_id uuid references public.partners(id) on delete set null,  -- 美容廠商 ID
  detailing_images jsonb,              -- 美容前後對比照片 URL 陣列（Supabase Storage URL）
  has_certification boolean default false,  -- 認證
  certification_date date,               -- 認證日期
  certification_provider text,           -- 認證單位名稱
  certification_images jsonb,           -- 認證證書掃描檔 URL 陣列
  has_transfer_done boolean default false,  -- 過戶完成
  transfer_documents jsonb,              -- 過戶文件 URL 陣列（例如：過戶登記書掃描）
  keys_count smallint default 0,        -- 鑰匙數量
  has_tax_certificate boolean default false,  -- 完稅證明
  tax_certificate_images jsonb,        -- 完稅證明掃描檔 URL 陣列
  has_origin_certificate boolean default false,  -- 出廠證明
  origin_certificate_images jsonb,      -- 出廠證明掃描檔 URL 陣列
  condition_grade text,                  -- 車況等級：A/B/C 或自訂
  condition_notes text,                 -- 車況備註
  equipment jsonb,                       -- 配備明細（例如：天窗、導航、倒車影像…）
  repair_history jsonb,                  -- 維修紀錄摘要（每個項目可包含：項目名稱、金額、廠商、日期、圖片 URL 陣列）
  expected_repair_cost numeric,         -- 預估修繕費
  status_tags jsonb,                     -- 狀態標籤陣列（系統自動產生，例如：["未美容", "缺證明"]）
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 庫存表（車輛所在倉庫）
create table if not exists public.vehicle_inventory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  location_code text,                   -- 位置代碼（例如：A區-03）
  status text default 'in_stock',        -- 庫存狀態：in_stock / reserved / outbound / returned
  stock_date date default current_date, -- 進此倉日期
  remark text,                          -- 備註
  created_at timestamptz default now()
);

-- 維修/服務報價表（預留比價用）
-- 注意：放在 vehicles 之後建立，避免外鍵參考不存在的資料表
create table if not exists public.service_quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  partner_id uuid not null references public.partners(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,  -- 針對哪台車的報價（可選）
  service_name text not null,            -- 服務名稱（例如：前保桿烤漆、5,000 公里保養）
  quoted_price numeric not null,         -- 報價金額
  currency text default 'TWD',          -- 幣別（預設 TWD）
  quote_date date default current_date,  -- 報價日期
  status text default 'pending',         -- 報價狀態：pending / accepted / rejected / in_progress / completed
  note text,                             -- 備註（例如：包含材料費、不含稅…）
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 4. 收購資訊與賣出資訊
-- ============================================================================

-- 聯絡人表（賣家/買家共用）
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  type text not null,                   -- 類型：seller / buyer / both / partner_contact
  name text not null,                   -- 姓名/稱呼
  phone text,                           -- 電話
  email text,                           -- Email
  id_number_hash text,                  -- 身分證/統編（建議做雜湊或加密，不存明碼）
  address text,                         -- 地址
  note text,                            -- 備註
  created_at timestamptz default now()
);

-- 收購資訊表
create table if not exists public.acquisitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vehicle_id uuid not null unique references public.vehicles(id) on delete cascade,  -- 一台車一筆主收購
  seller_contact_id uuid references public.contacts(id) on delete set null,  -- 賣家聯絡人 ID
  seller_type text,                     -- 賣家類型：individual / dealer / auction / company
  source_partner_id uuid references public.partners(id) on delete set null,  -- 若是合作車商/拍賣
  purchase_price numeric not null,      -- 收購價格
  purchase_date date default current_date,  -- 收購日期
  estimated_repair_cost numeric,        -- 預估修繕成本
  other_costs jsonb,                    -- 其他成本（牌照、保險、過戶費…）
  purchasing_staff_id uuid references public.tenant_members(id) on delete set null,  -- 採購人員
  note text,                            -- 備註
  created_at timestamptz default now()
);

-- 賣出資訊表
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,  -- 對應車輛 ID
  buyer_contact_id uuid references public.contacts(id) on delete set null,  -- 買家聯絡人 ID
  sale_price numeric not null,          -- 銷售價格
  sale_date date default current_date,  -- 銷售日期
  channel text,                         -- 銷售管道：in_store / website / marketplace / partner
  partner_id uuid references public.partners(id) on delete set null,  -- 代銷/合作商售出
  sales_staff_id uuid references public.tenant_members(id) on delete set null,  -- 業務/銷售人員 ID
  status text default 'pending',        -- 訂單狀態：pending / deposit / completed / cancelled
  deposit_amount numeric,               -- 訂金金額
  payment_status text default 'unpaid', -- 收款狀態：unpaid / partial / paid
  is_final boolean default false,       -- 是否為最終成交紀錄
  note text,                            -- 備註
  created_at timestamptz default now()
);

-- ============================================================================
-- 5. 預留未來前台/電商上架
-- ============================================================================

-- 上架紀錄表
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,  -- 所屬租戶 ID（暫時可為 null，之後補上）
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,  -- 對應車輛 ID
  channel text not null,                -- 上架管道：internal / website / marketplace / custom
  title text not null,                  -- 上架標題
  description text,                     -- 上架說明/文案
  listing_price numeric not null,       -- 對外標示售價
  status text default 'draft',          -- 上架狀態：draft / under_review / published / offline
  published_at timestamptz,             -- 發佈時間
  expired_at timestamptz,               -- 下架/到期時間
  created_at timestamptz default now(),
  created_by uuid references public.tenant_members(id) on delete set null  -- 建立人（成員 ID）
);

-- ============================================================================
-- 6. 建立索引（提升查詢效能）
-- ============================================================================

-- tenants 索引
create index if not exists idx_tenants_status on public.tenants(status);

-- tenant_members 索引
create index if not exists idx_tenant_members_tenant_id on public.tenant_members(tenant_id);
create index if not exists idx_tenant_members_user_id on public.tenant_members(user_id);
create index if not exists idx_tenant_members_status on public.tenant_members(status);
create index if not exists idx_tenant_members_organization_id on public.tenant_members(organization_id);
create index if not exists idx_tenant_members_department_id on public.tenant_members(department_id);
create index if not exists idx_tenant_members_custom_role_id on public.tenant_members(custom_role_id);

-- organizations 索引
create index if not exists idx_organizations_tenant_id on public.organizations(tenant_id);
create index if not exists idx_organizations_parent_id on public.organizations(parent_id);
create index if not exists idx_organizations_is_active on public.organizations(is_active);

-- departments 索引
create index if not exists idx_departments_tenant_id on public.departments(tenant_id);
create index if not exists idx_departments_organization_id on public.departments(organization_id);
create index if not exists idx_departments_is_active on public.departments(is_active);

-- custom_roles 索引
create index if not exists idx_custom_roles_tenant_id on public.custom_roles(tenant_id);
create index if not exists idx_custom_roles_base_role on public.custom_roles(base_role);
create index if not exists idx_custom_roles_is_system on public.custom_roles(is_system);

-- warehouses 索引
create index if not exists idx_warehouses_tenant_id on public.warehouses(tenant_id);
create index if not exists idx_warehouses_type on public.warehouses(type);
create index if not exists idx_warehouses_is_active on public.warehouses(is_active);

-- partners 索引
create index if not exists idx_partners_tenant_id on public.partners(tenant_id);
create index if not exists idx_partners_type on public.partners(type);
create index if not exists idx_partners_is_active on public.partners(is_active);

-- service_quotes 索引
create index if not exists idx_service_quotes_tenant_id on public.service_quotes(tenant_id);
create index if not exists idx_service_quotes_partner_id on public.service_quotes(partner_id);
create index if not exists idx_service_quotes_vehicle_id on public.service_quotes(vehicle_id);
create index if not exists idx_service_quotes_status on public.service_quotes(status);

-- vehicles 索引
create index if not exists idx_vehicles_tenant_id on public.vehicles(tenant_id);
create index if not exists idx_vehicles_vin on public.vehicles(vin);
create index if not exists idx_vehicles_plate_number on public.vehicles(plate_number);
create index if not exists idx_vehicles_status on public.vehicles(status);
create index if not exists idx_vehicles_make_model on public.vehicles(make, model);

-- vehicle_details 索引
create index if not exists idx_vehicle_details_tenant_id on public.vehicle_details(tenant_id);
create index if not exists idx_vehicle_details_vehicle_id on public.vehicle_details(vehicle_id);

-- vehicle_inventory 索引
create index if not exists idx_vehicle_inventory_tenant_id on public.vehicle_inventory(tenant_id);
create index if not exists idx_vehicle_inventory_vehicle_id on public.vehicle_inventory(vehicle_id);
create index if not exists idx_vehicle_inventory_warehouse_id on public.vehicle_inventory(warehouse_id);
create index if not exists idx_vehicle_inventory_status on public.vehicle_inventory(status);

-- contacts 索引
create index if not exists idx_contacts_tenant_id on public.contacts(tenant_id);
create index if not exists idx_contacts_type on public.contacts(type);

-- acquisitions 索引
create index if not exists idx_acquisitions_tenant_id on public.acquisitions(tenant_id);
create index if not exists idx_acquisitions_vehicle_id on public.acquisitions(vehicle_id);
create index if not exists idx_acquisitions_seller_contact_id on public.acquisitions(seller_contact_id);

-- sales 索引
create index if not exists idx_sales_tenant_id on public.sales(tenant_id);
create index if not exists idx_sales_vehicle_id on public.sales(vehicle_id);
create index if not exists idx_sales_buyer_contact_id on public.sales(buyer_contact_id);
create index if not exists idx_sales_status on public.sales(status);
create index if not exists idx_sales_is_final on public.sales(is_final);
-- 確保一台車只有一筆最終成交紀錄（partial unique index）
create unique index if not exists idx_sales_vehicle_id_final_unique on public.sales(vehicle_id) where is_final = true;

-- listings 索引
create index if not exists idx_listings_tenant_id on public.listings(tenant_id);
create index if not exists idx_listings_vehicle_id on public.listings(vehicle_id);
create index if not exists idx_listings_channel on public.listings(channel);
create index if not exists idx_listings_status on public.listings(status);

-- ============================================================================
-- 完成
-- ============================================================================

