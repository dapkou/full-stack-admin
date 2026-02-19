<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import { listStocksApi, type Stock } from "@/api/stocks";
import { ScanEye } from "lucide-vue-next";

const loading = ref(false);
const error = ref("");
const items = ref<Stock[]>([]);

// pagination
const page = ref(1);
const pageSize = ref(10);
const total = computed(() => items.value.length);

const tableData = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return items.value.slice(start, end);
});

const rangeText = computed(() => {
  if (total.value === 0) return { from: 0, to: 0, total: 0 };
  const from = (page.value - 1) * pageSize.value + 1;
  const to = Math.min(page.value * pageSize.value, total.value);
  return { from, to, total: total.value };
});

function onPageChange(p: number) {
  page.value = p;
}

function onSizeChange(size: number) {
  pageSize.value = size;
  page.value = 1;
}

// lifecycle-safe flag
let disposed = false;

onMounted(() => {
  disposed = false;
  load();
});

onBeforeUnmount(() => {
  disposed = true;
});

async function load() {
  loading.value = true;
  error.value = "";

  try {
    const data = await listStocksApi();
    if (disposed) return;

    items.value = data;
    page.value = 1;
  } catch (e: any) {
    if (disposed) return;
    error.value = e?.message || "載入失敗，請稍後再試";
  } finally {
    if (disposed) return;
    loading.value = false;
  }
}

// Detail dialog
const detailOpen = ref(false);
const selected = ref<Stock | null>(null);

function openDetail(row: Stock) {
  selected.value = row;
  detailOpen.value = true;
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-start justify-between gap-6 flex-wrap">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Stocks</h1>
        <p class="text-sm text-muted-foreground">股票清單與基本資訊</p>
      </div>
    </div>
    <div
      v-if="error"
      class="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
      role="alert"
    >
      {{ error }}
    </div>

    <div>
      <div v-if="!loading && !error && total === 0" class="py-10">
        <el-empty description="目前沒有股票資料">
          <button class="btn btn-primary" type="button" @click="load">
            重新載入
          </button>
        </el-empty>
      </div>
      <el-table
        v-else
        :data="tableData"
        v-loading="loading"
        class="app-table w-full"
        border
      >
        <el-table-column prop="symbol" label="Symbol" min-width="160" />
        <el-table-column prop="price" label="Price" width="140">
          <template #default="{ row }">
            <span class="font-medium">{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="220" align="right">
          <template #default="{ row }">
            <div class="flex justify-end gap-2">
              <button
                class="btn btn-outline btn-sm"
                type="button"
                @click="openDetail(row)"
              >
                <ScanEye class="h-4 w-4" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div
        v-if="total > 0"
        class="mt-4 flex items-center justify-between gap-3 flex-wrap"
      >
        <p class="text-sm text-muted-foreground">
          第
          <span class="text-foreground font-medium">{{ rangeText.from }}</span>
          -
          <span class="text-foreground font-medium">{{ rangeText.to }}</span>
          項，共
          <span class="text-foreground font-medium">{{ total }}</span>
          項
        </p>

        <el-pagination
          class="app-pagination"
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @update:current-page="onPageChange"
          @size-change="onSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <AppDialog
    v-model="detailOpen"
    :title="selected?.symbol || 'Stock Detail'"
    :showFooter="false"
    cancelText="Close"
    @cancel="detailOpen = false"
  >
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Symbol</span>
        <span class="font-medium text-foreground">{{ selected?.symbol }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Price</span>
        <span class="text-lg font-semibold text-foreground">
          {{ selected?.price }}
        </span>
      </div>
    </div>
  </AppDialog>
</template>
