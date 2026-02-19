<script setup lang="ts">
import { ref, toRefs } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import {
  ChartNoAxesColumnIncreasing,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { logout as authLogout } from "@/stores/auth";

const router = useRouter();
const APP_NAME = import.meta.env.VITE_APP_NAME || "App";

type Props = {
  variant?: "app" | "auth";
  sidebarOpen?: boolean;
  email?: string;
  isDark?: boolean;
  toggleTheme?: () => void;

  showSettings?: boolean;
  settingsPath?: string;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "app",
  showSettings: true,
  settingsPath: "/settings",
});

const { variant, sidebarOpen, email, isDark, toggleTheme, showSettings } =
  toRefs(props);

const emit = defineEmits<{
  (e: "toggleSidebar"): void;
}>();

const logoutConfirm = ref(false);
const logoutLoading = ref(false);

function openLogout() {
  logoutConfirm.value = true;
}

function goSettings() {
  router.push(props.settingsPath);
}

async function onLogout() {
  logoutLoading.value = true;
  try {
    authLogout();
    await router.replace("/login");
    logoutConfirm.value = false;
  } finally {
    logoutLoading.value = false;
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 h-16 w-full flex items-center justify-between px-4 bg-surface/95 backdrop-blur border-b border-border"
  >
    <div class="flex items-center gap-3 min-w-0">
      <button
        v-if="variant === 'app'"
        type="button"
        @click="emit('toggleSidebar')"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground shadow-sm hover:text-foreground active:scale-95 transition-all"
        :aria-label="sidebarOpen ? '收合側邊欄' : '展開側邊欄'"
      >
        <PanelLeftClose v-if="sidebarOpen" class="h-4 w-4" />
        <PanelLeftOpen v-else class="h-4 w-4" />
      </button>

      <div class="flex items-center gap-2 font-semibold min-w-0">
        <div
          class="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0"
          :class="variant === 'app' && 'hidden'"
        >
          <ChartNoAxesColumnIncreasing class="h-4 w-4" />
        </div>

        <span
          class="truncate text-foreground"
          :class="variant === 'app' && 'lg:hidden'"
        >
          {{ APP_NAME }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <button
        v-if="toggleTheme"
        type="button"
        @click="toggleTheme"
        class="btn btn-ghost"
        aria-label="切換主題"
      >
        <transition name="fade" mode="out-in">
          <component
            :is="isDark ? Sun : Moon"
            class="w-4 h-4 shrink-0"
            :key="String(isDark)"
          />
        </transition>
        <span class="text-sm whitespace-nowrap">
          {{ isDark ? "淺色模式" : "深色模式" }}
        </span>
      </button>

      <template v-if="variant === 'app'">
        <div class="hidden sm:block h-6 w-px bg-border" />

        <div class="hidden sm:block">
          <el-dropdown
            v-if="email"
            trigger="click"
            placement="bottom-end"
            popper-class="app-dropdown"
          >
            <button type="button" class="btn btn-ghost" aria-label="使用者選單">
              <div
                class="text-primary flex items-center justify-center shrink-0"
              >
                <User class="h-4 w-4" />
              </div>
              <span
                class="text-sm font-medium text-foreground truncate"
                :title="email"
              >
                {{ email }}
              </span>
            </button>

            <template #dropdown>
              <el-dropdown-menu class="app-dropdown-menu w-32">
                <el-dropdown-item
                  v-if="showSettings"
                  class="app-dropdown-item"
                  @click="goSettings"
                >
                  <Settings class="h-4 w-4" />
                  <span class="ml-2">設定</span>
                </el-dropdown-item>

                <el-dropdown-item
                  class="app-dropdown-item app-dropdown-item--danger"
                  @click="openLogout"
                >
                  <LogOut class="h-4 w-4" />
                  <span class="ml-2">登出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </div>
  </header>

  <AppDialog
    v-model="logoutConfirm"
    title="登出"
    message="確定要登出嗎？"
    confirmText="登出"
    cancelText="取消"
    danger
    :loading="logoutLoading"
    :closeOnClickModal="!logoutLoading"
    :closeOnPressEscape="!logoutLoading"
    @confirm="onLogout"
  />
</template>
