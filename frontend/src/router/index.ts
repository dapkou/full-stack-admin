import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import MainLayout from "@/layouts/Main.vue";

import { checkAuth } from "@/stores/auth";
import { authState } from "@/stores/auth-state";
import { getToken } from "@/api/http";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { public: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { public: true },
    },
    {
      path: "/",
      component: MainLayout,
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
          component: DashboardView,
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

let checking: Promise<any> | null = null;

router.beforeEach(async (to) => {
  const isPublic = to.matched.some((r) => Boolean(r.meta.public));
  const requiresAuth = to.matched.some((r) => Boolean(r.meta.requiresAuth));

  if (isPublic || !requiresAuth) return true;

  const token = getToken();
  if (!token) {
    return { name: "login" };
  }

  if (authState.user) return true;

  console.log("checking auth", to.fullPath);

  if (!checking) {
    console.log("[guard] checkAuth()");
    checking = checkAuth()
      .then((me) => (console.log("[guard] me ok", me), me))
      .catch((e) => (console.log("[guard] me fail", e), null))
      .finally(() => (console.log("[guard] done"), (checking = null)));
  }

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
