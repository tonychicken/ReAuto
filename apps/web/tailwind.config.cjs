/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
    "../../packages/ui/src/**/*.{vue,ts}"
  ],
  darkMode: "class", // 使用 class 策略來切換暗色模式
  theme: {
    extend: {
      colors: {
        // 統一專案的主色（品牌藍）
        primary: {
          50: "#e9f2ff",
          100: "#c7ddff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#10224f"
        },
        // App 級別的語意色票，支持深色/淺色模式（使用 CSS 變數）
        app: {
          // 主背景（整個畫面）- 自動根據主題切換
          bg: "var(--app-bg)",
          // 卡片 / 面板 - 自動根據主題切換
          surface: "var(--app-surface)",
          // 次要區塊背景 - 自動根據主題切換
          muted: "var(--app-muted)",
          // 邊框 - 自動根據主題切換
          border: "var(--app-border)",
          // 側邊欄底色 - 自動根據主題切換
          sidebar: "var(--app-sidebar)",
          // 側邊欄邊框 - 自動根據主題切換
          sidebarBorder: "var(--app-sidebar-border)",
          // 側邊欄強調色 - 自動根據主題切換
          sidebarAccent: "var(--app-sidebar-accent)",
          // 文字顏色
          text: {
            // 主要文字 - 自動根據主題切換
            primary: "var(--app-text-primary)",
            // 次要文字 - 自動根據主題切換
            secondary: "var(--app-text-secondary)",
            // 弱化文字 - 自動根據主題切換
            muted: "var(--app-text-muted)"
          }
        }
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};


