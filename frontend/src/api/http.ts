const TOKEN_KEY = "token";
const API_PREFIX = "/api/v1";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// 統一錯誤格式
export type ApiError = Error & {
  status: number;
  detail?: unknown; // 後端原始錯誤內容
};

type HttpMethod = "GET" | "POST";

// 處理 401
let onAuthExpired: ((status: number, detail?: unknown) => void) | null = null;

export function setOnAuthExpired(
  fn: (status: number, detail?: unknown) => void,
) {
  onAuthExpired = fn;
}

//  URL 前綴
function withPrefix(path: string) {
  if (path.startsWith(API_PREFIX + "/") || path === API_PREFIX) return path;
  if (!path.startsWith("/")) return `${API_PREFIX}/${path}`;
  return `${API_PREFIX}${path}`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// FastAPI 錯誤訊息
function extractFastApiMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;

  const detail = (body as any).detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (
      first &&
      typeof first === "object" &&
      typeof (first as any).msg === "string"
    ) {
      return (first as any).msg;
    }
  }

  return null;
}

function makeError(status: number, body: unknown): ApiError {
  const msgFromFastApi = extractFastApiMessage(body);

  const message =
    msgFromFastApi ?? (typeof body === "string" ? body : `HTTP ${status}`);

  const err = new Error(message) as ApiError;
  err.status = status;
  err.detail = body;

  return err;
}

// 驗證失效錯誤
export class AuthExpiredError extends Error {
  status = 401;
  detail?: unknown;

  constructor(status: number, detail?: unknown) {
    super("AUTH_EXPIRED");
    this.name = "AuthExpiredError";
    this.status = status;
    this.detail = detail;
  }
}

export async function http<T>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    auth?: boolean;
  },
): Promise<T> {
  const method = options?.method ?? "GET";
  const auth = options?.auth ?? true;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 自動帶 Authorization
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = withPrefix(path);

  const res = await fetch(url, {
    method,
    headers,
    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const body = await parseBody(res);

  // 錯誤處理
  if (!res.ok) {
    if (res.status === 401) {
      onAuthExpired?.(res.status, body);
      throw new AuthExpiredError(res.status, body);
    }
    // 其他錯誤
    throw makeError(res.status, body);
  }

  return body as T;
}

// 不帶 token 的 API（login / register）
export function httpPublic<T>(
  path: string,
  options?: { method?: HttpMethod; body?: unknown },
) {
  return http<T>(path, { ...options, auth: false });
}
