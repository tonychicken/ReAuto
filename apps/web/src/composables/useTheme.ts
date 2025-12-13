import { ref, watch } from "vue";

export type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "app-theme";

// 當前主題模式
const themeMode = ref<ThemeMode>("system");

// 實際應用的主題（light 或 dark）
const effectiveTheme = ref<"light" | "dark">("dark");

/**
 * 獲取系統偏好主題
 */
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * 應用主題到 document
 */
function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }

  effectiveTheme.value = theme;
}

/**
 * 更新有效主題
 */
function updateEffectiveTheme() {
  if (themeMode.value === "system") {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
  } else {
    applyTheme(themeMode.value);
  }
}

/**
 * 初始化主題
 */
function initTheme() {
  // 從 localStorage 讀取保存的主題
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (saved && ["light", "dark", "system"].includes(saved)) {
    themeMode.value = saved;
  }

  // 應用主題
  updateEffectiveTheme();

  // 監聽系統主題變化（僅在 system 模式下）
  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode.value === "system") {
        updateEffectiveTheme();
      }
    };

    // 使用 addEventListener 而不是 addListener（更現代的方式）
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // 兼容舊版瀏覽器
      mediaQuery.addListener(handleChange);
    }
  }
}

/**
 * 設置主題模式
 */
function setThemeMode(mode: ThemeMode) {
  themeMode.value = mode;
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  updateEffectiveTheme();
}

/**
 * 主題管理 Composable
 */
export function useTheme() {
  // 監聽 themeMode 變化
  watch(themeMode, () => {
    updateEffectiveTheme();
  });

  // 初始化主題（在客戶端立即執行）
  if (typeof window !== "undefined") {
    initTheme();
  }

  return {
    themeMode,
    effectiveTheme,
    setThemeMode,
    getSystemTheme
  };
}

