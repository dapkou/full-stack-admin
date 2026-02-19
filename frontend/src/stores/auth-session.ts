import router from "@/router";
import { clearToken } from "@/api/http";
import { authState } from "@/stores/auth-state";

let handling = false;

// 登入逾時、登出
type EndReason = "expired" | "logout";

export function endSession(reason: EndReason) {
  if (handling) return;
  handling = true;

  clearToken();

  authState.user = null;
  authState.isChecking = false;

  const current = router.currentRoute.value;

  // 排除登入頁
  if (current.name === "login") {
    handling = false;
    return;
  }

  router
    .replace({
      name: "login",
      query: reason === "expired" ? { r: "expired" } : {},
    })
    .finally(() => {
      handling = false;
    });
}
