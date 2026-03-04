import { createRouter, createWebHistory } from "vue-router";
import { checkAuth } from "@/stores/auth";
import { authState } from "@/stores/auth-state";
import { getToken } from "@/api/http";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: { public: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
      meta: { public: true },
    },
    {
      path: "/",
      component: () => import("@/layouts/Main.vue"),
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: { name: "dashboard" }, meta: { hidden: true } },
        {
          path: "settings",
          name: "settings",
          component: () => import("@/views/account/SettingsView.vue"),
          meta: { hidden: true },
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/DashboardView.vue"),
          meta: { sidebar: { label: "Dashboard", icon: "LayoutDashboard" } },
        },
        {
          path: "stocks",
          name: "stocks",
          component: () => import("@/views/stocks/StocksListView.vue"),
          meta: { sidebar: { label: "Stocks", icon: "LineChart" } },
        },
      ],
    },
  ],
});

// 用來避免同時間重複呼叫 checkAuth 
let checking: Promise<any> | null = null;

router.beforeEach(async (to) => {
  // 公開頁面
  const isPublic = to.matched.some((r) => Boolean(r.meta.public));
  // 需要驗證
  const requiresAuth = to.matched.some((r) => Boolean(r.meta.requiresAuth));

  // 公開頁或不需登入
  if (isPublic || !requiresAuth) return true;

  const token = getToken();
  if (!token) {
    return { name: "login" };
  }

  if (authState.user) return true;

  console.log("checking auth", to.fullPath);

  // 避免重複請求
  if (!checking) {
    console.log("[guard] checkAuth()");
    checking = checkAuth()
      .then((me) => (console.log("[guard] me ok", me), me))
      .catch((e) => (console.log("[guard] me fail", e), null))
      .finally(() => (console.log("[guard] done"), (checking = null)));
  }

  // 等待驗證結果
  let me = null;
  try {
    me = await checking;
  } catch {
    me = null;
  }

  if (!me) return { name: "login" };
  return true;
});

export default router;
