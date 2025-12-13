import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "../../packages/core/src"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src")
    }
  },
  server: {
    port: 5173
  }
});


