import { http, httpPublic } from "./http";

// Types
export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
  created_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// 兩種 token 格式
export type LoginResponse =
  | { token: string }
  | { access_token: string; token_type?: string };

export type MeResponse = {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
};

// API
export function registerApi(payload: RegisterRequest) {
  return httpPublic<RegisterResponse>("accounts/register", {
    method: "POST",
    body: payload,
  });
}

export function loginApi(payload: LoginRequest) {
  return httpPublic<LoginResponse>("accounts/login", {
    method: "POST",
    body: payload,
  });
}

export function meApi() {
  return http<MeResponse>("accounts/me");
}
