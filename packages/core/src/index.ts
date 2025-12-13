export * from "./supabase/client";
export * from "./auth";

// Managers
export * from "./managers/inventory/InventoryManager";
export * from "./managers/warehouse/WarehouseManager";
export * from "./managers/partner/PartnerManager";
export * from "./managers/vehicle/VehicleManager";
export * from "./managers/vehicle-inventory/VehicleInventoryManager";
export * from "./managers/vehicle-details/VehicleDetailsManager";
export * from "./managers/service-quote/ServiceQuoteManager";
export * from "./managers/tenant/TenantManager";
export * from "./managers/tenant-member/TenantMemberManager";
export * from "./managers/contact/ContactManager";
export * from "./managers/acquisition/AcquisitionManager";

// 導出 Manager 實例
export { warehouseManager } from "./managers/warehouse/WarehouseManager";
export { partnerManager } from "./managers/partner/PartnerManager";
export { vehicleManager } from "./managers/vehicle/VehicleManager";
export { inventoryManager } from "./managers/inventory/InventoryManager";
export { vehicleInventoryManager } from "./managers/vehicle-inventory/VehicleInventoryManager";
export { vehicleDetailsManager } from "./managers/vehicle-details/VehicleDetailsManager";
export { serviceQuoteManager } from "./managers/service-quote/ServiceQuoteManager";
export { tenantManager } from "./managers/tenant/TenantManager";
export { tenantMemberManager } from "./managers/tenant-member/TenantMemberManager";
export { contactManager } from "./managers/contact/ContactManager";
export { acquisitionManager } from "./managers/acquisition/AcquisitionManager";

