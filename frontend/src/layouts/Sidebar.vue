<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import clsx from "clsx";
import { ChevronDown } from "lucide-vue-next";
import { ChartNoAxesColumnIncreasing, Sun, Moon, User } from "lucide-vue-next";
import type { Component } from "vue";
const APP_NAME = import.meta.env.VITE_APP_NAME || "App";

type NavChild = { label: string; path: string; icon: Component };
type NavItem = {
  label: string;
  icon: Component;
  path?: string;
  children?: NavChild[];
};

type Props = {
  sidebarOpen: boolean;
  navItems: NavItem[];
  expandedMenus: string[];
  onToggleMenu: (label: string) => void;
  onToggle: () => void;
  isActive: (path: string) => boolean;

  // email?: string;
  // isDark?: boolean;
  // toggleTheme?: () => void;
};

const props = defineProps<Props>();
const isMobile = () => window.matchMedia("(max-width: 1023px)").matches;
const asideClass = computed(() =>
  clsx(
    // base
    "border-r border-border bg-background",
    // mobile: overlay drawer
    "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-200 lg:transition-none",
    props.sidebarOpen ? "translate-x-0" : "-translate-x-full",
    // desktop: in grid flow, take full height, span rows
    "lg:static lg:translate-x-0 lg:w-full lg:row-span-2 lg:h-dvh",
  ),
);

const overlayClass = computed(() =>
  clsx(
    "fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity lg:hidden",
    props.sidebarOpen
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0",
  ),
);

function handleParentClick(label: string) {
  if (!props.sidebarOpen) props.onToggle();
  props.onToggleMenu(label);
}

function handleNavClick() {
  if (isMobile()) props.onToggle();
}
</script>

<template>
  <div :class="overlayClass" @click="props.onToggle" />
  <aside :class="asideClass">
    <div class="flex h-full min-h-0 flex-col bg-muted">
      <!-- app name -->
      <div class="h-16 shrink-0 flex items-center border-b border-border px-4">
        <div
          :class="
            clsx(
              'flex items-center w-full',
              props.sidebarOpen ? 'gap-3 justify-start' : 'justify-center',
            )
          "
        >
          <div
            class="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0"
          >
            <ChartNoAxesColumnIncreasing class="h-4 w-4" />
          </div>
          <span
            v-if="props.sidebarOpen"
            class="truncate font-semibold text-foreground"
          >
            {{ APP_NAME }}
          </span>
        </div>
      </div>
      <!-- nav -->
      <nav
        :class="
          clsx(
            'flex-1 min-h-0 space-y-1 overflow-y-auto p-4',
            !props.sidebarOpen && 'lg:px-2',
          )
        "
      >
        <div
          v-for="(item, idx) in props.navItems"
          :key="`${item.label}-${idx}`"
        >
          <template v-if="item.children?.length">
            <button
              type="button"
              @click="handleParentClick(item.label)"
              :class="
                (() => {
                  const parentActive =
                    (item.path ? props.isActive(item.path) : false) ||
                    (item.children?.some((c) => props.isActive(c.path)) ??
                      false);

                  return clsx(
                    'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    parentActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-accent hover:text-foreground',
                    props.sidebarOpen
                      ? 'justify-between'
                      : 'justify-between lg:justify-center',
                  );
                })()
              "
              :title="!props.sidebarOpen ? item.label : undefined"
            >
              <div
                :class="
                  clsx(
                    'flex items-center',
                    props.sidebarOpen ? 'gap-3' : 'gap-3 lg:gap-0',
                  )
                "
              >
                <component :is="item.icon" class="h-5 w-5 shrink-0" />
                <span
                  :class="clsx('truncate', !props.sidebarOpen && 'lg:hidden')"
                >
                  {{ item.label }}
                </span>
              </div>

              <ChevronDown
                :class="
                  (() => {
                    const isExpanded = props.expandedMenus.includes(item.label);
                    return clsx(
                      'h-4 w-4 shrink-0 transition-transform',
                      !props.sidebarOpen && 'lg:hidden',
                      isExpanded && 'rotate-180',
                    );
                  })()
                "
              />
            </button>

            <div
              v-if="
                props.sidebarOpen && props.expandedMenus.includes(item.label)
              "
              class="ml-4 mt-1 space-y-1"
            >
              <RouterLink
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                @click="handleNavClick"
                :class="
                  (() => {
                    const childActive = props.isActive(child.path);
                    return clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      childActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                    );
                  })()
                "
              >
                <component :is="child.icon" class="h-4 w-4 shrink-0" />
                <span class="truncate">{{ child.label }}</span>
              </RouterLink>
            </div>
          </template>

          <template v-else>
            <RouterLink
              v-if="item.path"
              :to="item.path"
              @click="handleNavClick"
              :class="
                clsx(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  props.isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-accent hover:text-foreground',
                  props.sidebarOpen
                    ? 'gap-3'
                    : 'justify-between gap-3 lg:justify-center',
                )
              "
              :title="!props.sidebarOpen ? item.label : undefined"
            >
              <component :is="item.icon" class="h-5 w-5 shrink-0" />
              <span
                :class="clsx('truncate', !props.sidebarOpen && 'lg:hidden')"
              >
                {{ item.label }}
              </span>
            </RouterLink>
          </template>
        </div>
      </nav>
      <!-- footer (user info) -->
      <!-- <div class="mt-auto border-t border-border p-3">
        <div
          class="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent transition-colors"
          :class="!props.sidebarOpen && 'justify-center'"
        >
          <div
            class="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0"
          >
            <User class="h-4 w-4" />
          </div>
          <div
            v-if="props.sidebarOpen"
            class="flex-1 min-w-0 text-sm text-foreground truncate"
          >
            {{ props.email || "未登入" }}
          </div>
          <button
            v-if="props.toggleTheme"
            @click="props.toggleTheme"
            class="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            :title="props.isDark ? '淺色模式' : '深色模式'"
          >
            <Sun v-if="props.isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>
        </div>
      </div> -->
    </div>
  </aside>
</template>
