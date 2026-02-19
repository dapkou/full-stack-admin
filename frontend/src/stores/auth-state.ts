import { reactive } from "vue";
import type { MeResponse } from "@/api/accounts";

export type AuthState = {
  user: MeResponse | null;
  isChecking: boolean;
};

export const authState = reactive<AuthState>({
  user: null,
  isChecking: false,
});