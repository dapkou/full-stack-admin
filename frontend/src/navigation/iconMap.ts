import { LayoutDashboard, LineChart, User, Settings } from "lucide-vue-next";

export const iconMap = {
  LayoutDashboard,
  LineChart,
  User,
  Settings,
} as const;

export type IconName = keyof typeof iconMap;

export function isIconName(v: unknown): v is IconName {
  return typeof v === "string" && v in iconMap;
}
