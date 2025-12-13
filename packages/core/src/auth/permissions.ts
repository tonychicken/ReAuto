/**
 * 權限管理系統
 * 定義各角色的預設權限（R-W-X），並提供權限檢查功能
 */

import type { UserRole, Permission } from "./types";
import { getCurrentUserRole, getAuthContext } from "./context";

/**
 * 模組列表
 */
export type Module =
  | "organization" // 組織管理
  | "warehouse" // 倉庫管理
  | "partner" // 維修廠管理
  | "vehicle" // 車輛管理
  | "inventory" // 庫存管理
  | "acquisition" // 收購管理
  | "sale" // 銷售管理
  | "listing" // 上架管理
  | "subscription"; // 訂閱管理

/**
 * 預設權限矩陣（根據 system-spec-v1.md）
 */
const DEFAULT_PERMISSIONS: Record<UserRole, Record<Module, Permission>> = {
  owner: {
    organization: { module: "organization", read: true, write: true, execute: true },
    warehouse: { module: "warehouse", read: true, write: true, execute: true },
    partner: { module: "partner", read: true, write: true, execute: true },
    vehicle: { module: "vehicle", read: true, write: true, execute: true },
    inventory: { module: "inventory", read: true, write: true, execute: true },
    acquisition: { module: "acquisition", read: true, write: true, execute: true },
    sale: { module: "sale", read: true, write: true, execute: true },
    listing: { module: "listing", read: true, write: true, execute: true },
    subscription: { module: "subscription", read: true, write: true, execute: true }
  },
  manager: {
    organization: { module: "organization", read: true, write: true, execute: false },
    warehouse: { module: "warehouse", read: true, write: true, execute: true },
    partner: { module: "partner", read: true, write: true, execute: true },
    vehicle: { module: "vehicle", read: true, write: true, execute: true },
    inventory: { module: "inventory", read: true, write: true, execute: true },
    acquisition: { module: "acquisition", read: true, write: true, execute: true },
    sale: { module: "sale", read: true, write: true, execute: true },
    listing: { module: "listing", read: true, write: true, execute: true },
    subscription: { module: "subscription", read: false, write: false, execute: false }
  },
  staff: {
    organization: { module: "organization", read: true, write: false, execute: false },
    warehouse: { module: "warehouse", read: true, write: false, execute: false },
    partner: { module: "partner", read: true, write: true, execute: true },
    vehicle: { module: "vehicle", read: true, write: true, execute: true },
    inventory: { module: "inventory", read: true, write: true, execute: true },
    acquisition: { module: "acquisition", read: true, write: true, execute: true },
    sale: { module: "sale", read: true, write: true, execute: true },
    listing: { module: "listing", read: true, write: true, execute: true },
    subscription: { module: "subscription", read: false, write: false, execute: false }
  },
  viewer: {
    organization: { module: "organization", read: true, write: false, execute: false },
    warehouse: { module: "warehouse", read: true, write: false, execute: false },
    partner: { module: "partner", read: true, write: false, execute: false },
    vehicle: { module: "vehicle", read: true, write: false, execute: false },
    inventory: { module: "inventory", read: true, write: false, execute: false },
    acquisition: { module: "acquisition", read: true, write: false, execute: false },
    sale: { module: "sale", read: true, write: false, execute: false },
    listing: { module: "listing", read: true, write: false, execute: false },
    subscription: { module: "subscription", read: false, write: false, execute: false }
  }
};

/**
 * 取得使用者在指定模組的權限
 */
export function getPermission(module: Module): Permission | null {
  const role = getCurrentUserRole() as UserRole | null;
  if (!role) {
    return null;
  }

  const defaultPermission = DEFAULT_PERMISSIONS[role]?.[module];
  if (!defaultPermission) {
    return null;
  }

  // 檢查是否有自訂權限覆蓋
  const authContext = getAuthContext();
  if (authContext.member?.permissions && authContext.member.permissions[module]) {
    const customPerm = authContext.member.permissions[module] as Partial<Permission>;
    return {
      module,
      read: customPerm.read ?? defaultPermission.read,
      write: customPerm.write ?? defaultPermission.write,
      execute: customPerm.execute ?? defaultPermission.execute
    };
  }

  return defaultPermission;
}

/**
 * 檢查是否有讀取權限
 */
export function canRead(module: Module): boolean {
  const permission = getPermission(module);
  return permission?.read ?? false;
}

/**
 * 檢查是否有寫入權限
 */
export function canWrite(module: Module): boolean {
  const permission = getPermission(module);
  return permission?.write ?? false;
}

/**
 * 檢查是否有執行權限
 */
export function canExecute(module: Module): boolean {
  const permission = getPermission(module);
  return permission?.execute ?? false;
}

/**
 * 檢查是否為 Owner
 */
export function isOwner(): boolean {
  return getCurrentUserRole() === "owner";
}

/**
 * 檢查是否為 Manager 或以上
 */
export function isManagerOrAbove(): boolean {
  const role = getCurrentUserRole();
  return role === "owner" || role === "manager";
}

/**
 * 檢查是否為 Staff 或以上
 */
export function isStaffOrAbove(): boolean {
  const role = getCurrentUserRole();
  return role === "owner" || role === "manager" || role === "staff";
}


