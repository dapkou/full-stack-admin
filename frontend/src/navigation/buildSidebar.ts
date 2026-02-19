import router from "@/router";
import { iconMap } from "@/navigation/iconMap";
import type { RouteRecordRaw } from "vue-router";

type IconName = keyof typeof iconMap;

type SidebarMeta = {
  sidebar?: {
    label: string;
    icon: IconName;
  };
  hidden?: boolean;
};

export type SidebarItem = {
  label: string;
  icon: (typeof iconMap)[IconName];
  path: string;
};

function isSidebarRoute(r: RouteRecordRaw): r is RouteRecordRaw & {
  meta: SidebarMeta & { sidebar: { label: string; icon: IconName } };
} {
  const meta = r.meta as SidebarMeta | undefined;
  return Boolean(meta?.sidebar) && !Boolean(meta?.hidden);
}

function withLeadingSlash(p: string) {
  return p.startsWith("/") ? p : `/${p}`;
}

export function buildSidebar(): SidebarItem[] {
  // 從 raw routes 找到 "/" 那層 layout
  const layout = router.options.routes.find((r) => r.path === "/");
  const children = (layout?.children ?? []) as RouteRecordRaw[];

  return children
    .filter(isSidebarRoute) // 只有 meta.sidebar 的 route，redirect 會被排除
    .map((r) => {
      const meta = r.meta as SidebarMeta & {
        sidebar: { label: string; icon: IconName };
      };

      return {
        label: meta.sidebar.label,
        icon: iconMap[meta.sidebar.icon],
        path: withLeadingSlash(r.path),
      };
    });
}
