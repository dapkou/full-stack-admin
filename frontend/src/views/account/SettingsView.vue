<script setup lang="ts">
import { computed } from "vue";
import { authState } from "@/stores/auth-state";
import AppCard from "@/components/AppCard.vue";
import { ElMessage } from "element-plus";

const email = computed(() => authState.user?.email ?? "");
const fullName = computed(() => authState.user?.full_name ?? "");
const createdAt = computed(() => authState.user?.created_at ?? "");

function onUpdateClick() {
  ElMessage.info("目前尚未實作「更新資料」功能");
}

const formattedCreatedAt = computed(() => {
  if (!createdAt.value) return "";
  const d = new Date(createdAt.value);

  const date = d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const time = d.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-start justify-between gap-6 flex-wrap">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="text-sm text-muted-foreground">會員資料與設定</p>
      </div>
    </div>
    <AppCard class="h-full" title="基本資料" subtitle="" padding="md">
      <template #actions>
         <!-- <button class="btn btn-primary" type="button" @click="onUpdateClick">
          更新資料
        </button> -->
      </template>
      <div class="space-y-4">
        <el-form label-position="top">
          <el-form-item label="姓名">
            <el-input
              :model-value="fullName"
              size="large"
              disabled
              placeholder="-"
            />
          </el-form-item>

          <el-form-item label="Email">
            <el-input
              :model-value="email"
              size="large"
              disabled
              placeholder="-"
            />
          </el-form-item>

          <el-form-item label="建立於">
            <el-input
              :model-value="formattedCreatedAt"
              size="large"
              disabled
              placeholder="-"
            />
          </el-form-item>
        </el-form>
      </div>
    </AppCard>
  </div>
</template>
