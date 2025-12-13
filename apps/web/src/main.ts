import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { useTheme } from "./composables/useTheme";

// 在應用啟動時初始化主題（避免閃爍）
useTheme();

const app = createApp(App);
app.use(router);
app.mount("#app");


