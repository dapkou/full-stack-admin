import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";

import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "./styles/element-plus-vars.css";

import ElementPlus from "element-plus";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import { ElMessage } from "element-plus";

import { setOnAuthExpired } from "@/api/http";
import { endSession } from "@/stores/auth-session";

type ThemeMode = "light" | "dark";

function initTheme() {
  const saved = (localStorage.getItem("theme") as ThemeMode | null) ?? "light";
  document.documentElement.classList.toggle("dark", saved === "dark");
}

let lastAuthExpiredAt = 0;

setOnAuthExpired(() => {
  const now = Date.now();
  const current = router.currentRoute.value;
  if (current.name === "login") return;

  // 只顯示一次提示
  if (now - lastAuthExpiredAt > 1500) {
    lastAuthExpiredAt = now;
    ElMessage.warning("登入已逾時，請重新登入");
  }

  endSession("expired");
});

initTheme();

createApp(App).use(router).use(ElementPlus, { locale: zhTw }).mount("#app");