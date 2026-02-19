<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Sidebar from "@/layouts/Sidebar.vue";
import Header from "@/layouts/Header.vue";
import { useTheme } from "@/stores/theme";
import { logout as authLogout } from "@/stores/auth";
import { authState } from "@/stores/auth-state";
import { buildSidebar } from "@/navigation/buildSidebar";

const router = useRouter();
const route = useRoute();

const { isDark, toggleTheme } = useTheme();
const email = computed(() => authState.user?.email ?? "");

// sidebar items
const navItems = buildSidebar();

// sidebar state
const sidebarOpen = ref(true);
const expandedMenus = ref<string[]>([]);

function onToggle() {
  sidebarOpen.value = !sidebarOpen.value;
}

function onToggleMenu(label: string) {
  const i = expandedMenus.value.indexOf(label);
  if (i >= 0) expandedMenus.value.splice(i, 1);
  else expandedMenus.value.push(label);
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + "/");
}

async function onLogout() {
  authLogout();
  await router.push("/login");
}
</script>

<template>
  <div class="h-dvh bg-background text-foreground">
    <!-- desktop: grid; mobile: normal flow -->
    <div
      :class="[
        'h-dvh',
        'lg:grid lg:grid-rows-[64px_1fr] lg:transition-[grid-template-columns] lg:duration-200',
        sidebarOpen ? 'lg:grid-cols-[256px_1fr]' : 'lg:grid-cols-[64px_1fr]',
      ]"
    >
      <!-- Sidebar (desktop in grid, mobile fixed overlay) -->
      <Sidebar
        :sidebarOpen="sidebarOpen"
        :navItems="navItems"
        :expandedMenus="expandedMenus"
        :onToggleMenu="onToggleMenu"
        :onToggle="onToggle"
        :isActive="isActive"
        :email="email"
        :isDark="isDark"
        :toggleTheme="toggleTheme"
        class="lg:static"
      />

      <!-- Header -->
      <Header
        variant="app"
        :sidebarOpen="sidebarOpen"
        :email="email"
        :isDark="isDark"
        :toggleTheme="toggleTheme"
        @toggleSidebar="onToggle"
        @logout="onLogout"
        class="lg:col-start-2 lg:row-start-1"
      />

      <!-- Content -->
      <div class="lg:col-start-2 lg:row-start-2 overflow-hidden">
        <div class="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
