import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import InventoryDashboard from "@/views/inventory/InventoryDashboard.vue";
import AcquisitionPage from "@/views/inventory/AcquisitionPage.vue";
import ManagerDashboard from "@/views/manager/ManagerDashboard.vue";
import WarehouseManagerPage from "@/views/manager/WarehouseManagerPage.vue";
import PartnerManagerPage from "@/views/manager/PartnerManagerPage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import AuthCallbackPage from "@/views/auth/AuthCallbackPage.vue";
import ResetPasswordPage from "@/views/auth/ResetPasswordPage.vue";
import TenantSetupPage from "@/views/auth/TenantSetupPage.vue";
import OrganizationPage from "@/views/organization/OrganizationPage.vue";
import LandingPage from "@/views/landing/LandingPage.vue";
import OnboardingPage from "@/views/landing/OnboardingPage.vue";
import { supabaseClient } from "@core";

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

function getSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // 開發環境：使用 URL 參數
  if (isDevelopment) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tenantCode');
  }
  // 生產環境：從子域名判斷
  const parts = hostname.split('.');
  if (parts.length <= 2 || parts[0] === 'www') {
    return null; // 主域名，顯示行銷頁面
  }
  
  return parts[0]; // 返回子域名
}

// 公開路由（不需要認證）
const publicRoutes = ["landing", "login", "auth-callback", "reset-password", "onboarding"];

const routes: RouteRecordRaw[] = [
  { path: "/landing", name: "landing", component: LandingPage },
  { path: "/onboarding", name: "onboarding", component: OnboardingPage },
  { path: "/tenant-setup", name: "tenant-setup", component: TenantSetupPage },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/auth/callback", name: "auth-callback", component: AuthCallbackPage },
  { path: "/reset-password", name: "reset-password", component: ResetPasswordPage },
  { path: "/", name: "home", redirect: "/landing" },
  { path: "/manager/inventory", name: "manager-inventory", component: InventoryDashboard },
  { path: "/manager/inventory/acquisition", name: "acquisition", component: AcquisitionPage },
  { path: "/manager", name: "manager", component: ManagerDashboard },
  { path: "/manager/warehouses", name: "manager-warehouses", component: WarehouseManagerPage },
  { path: "/manager/partners", name: "manager-partners", component: PartnerManagerPage },
  { path: "/organization", name: "organization", component: OrganizationPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守衛：檢查認證狀態
router.beforeEach(async (to, from, next) => {
  const subdomain = getSubdomain();
  // 檢查是否為公開路由
  const isPublicRoute = publicRoutes.includes(to.name as string);
  // 如果是公開路由，直接允許訪問
  if (isPublicRoute) {
    next();
    return;
  }
  // 處理首頁重導向
  if (to.name === "landing" || to.name === "home" || to.path === "/") {
    const tenantCode = to.query.tenantCode as string;
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (tenantCode) {
      if (!session) {
        next({ 
          name: "login", 
          query: { tenantCode } 
        });
      } else {
        next({ name: "manager-inventory" });
      }
    } else {
      next({ name: "landing" });
    }
    return;
  }
  
  // 檢查是否有 tenantCode 參數
  const tenantCode = to.query.tenantCode as string;
  
  // 檢查 Supabase session 來判斷是否已登入
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (!session) {
    // 未登入，禁止訪問後台系統，必須重導向
    if (tenantCode) {
      // 有 tenantCode，導向到登入頁面
      next({ 
        name: "login", 
        query: { 
          redirect: to.fullPath,
          tenantCode: tenantCode
        } 
      });
    } else {
      // 沒有 tenantCode，導向到行銷網站
      next({ 
        name: "landing",
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    // 已登入，允許訪問
    next();
  }
});

export default router;