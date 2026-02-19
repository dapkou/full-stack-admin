import { getToken, setToken, AuthExpiredError } from "@/api/http";
import { authState } from "@/stores/auth-state";
import { endSession } from "@/stores/auth-session";
import { loginApi, meApi, type LoginResponse } from "@/api/accounts";

function normalizeToken(res: LoginResponse): string {
  return "access_token" in res ? res.access_token : res.token;
}

export async function login(email: string, password: string) {
  const res = await loginApi({ email, password });

  setToken(normalizeToken(res));

  // 取得登入資訊
  const me = await meApi();

  // 更新使用者狀態
  authState.user = me;

  return me;
}

export async function checkAuth() {
  const token = getToken();

  if (!token) {
    authState.user = null;
    return null;
  }

  authState.isChecking = true;

  try {
    // 驗證 token 是否有效
    const me = await meApi();

    authState.user = me;
    return me;
  } catch (e: any) {
    const status = Number(e?.status ?? 0);

    // 判斷是否為 token 過期 / 無效
    const isExpired =
      e instanceof AuthExpiredError || status === 401;

    if (isExpired) {
      // 清空登入狀態
      authState.user = null;
      return null;
    }

    throw e;
  } finally {
    authState.isChecking = false;
  }
}

// 登出
export function logout() {
  endSession("logout");
}
