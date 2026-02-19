<script setup lang="ts">
import { computed, useSlots } from "vue";
import { X } from "lucide-vue-next";

type Props = {
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  width?: string | number;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  showFooter?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  title: "確認操作",
  message: "",
  confirmText: "確認",
  cancelText: "取消",
  danger: false,
  loading: false,
  width: 420,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showFooter: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

function onCancel() {
  emit("cancel");
  open.value = false;
}

function onConfirm() {
  emit("confirm");
}
</script>

<template>
  <el-dialog
    v-model="open"
    :width="props.width"
    align-center
    :close-on-click-modal="props.closeOnClickModal"
    :close-on-press-escape="props.closeOnPressEscape"
    :show-close="false"
    append-to-body
    :z-index="9999"
    class="app-dialog app-confirm-dialog"
  >
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-base font-semibold text-foreground truncate">
            {{ props.title }}
          </div>
        </div>

        <button
          class="text-foreground hover:text-primary/80 active:text-primary/60 transition-colors"
          type="button"
          aria-label="Close"
          @click="onCancel"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </template>

    <!-- body -->
    <div v-if="hasDefaultSlot" class="py-1">
      <slot />
    </div>
    <div v-else class="text-sm text-muted-foreground leading-relaxed">
      {{ props.message }}
    </div>

    <!-- footer -->
    <template v-if="props.showFooter" #footer>
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-ghost"
          type="button"
          :disabled="props.loading"
          @click="onCancel"
        >
          {{ props.cancelText }}
        </button>

        <button
          type="button"
          :class="['btn', props.danger ? 'btn-danger' : 'btn-primary']"
          :disabled="props.loading"
          @click="onConfirm"
        >
          <span v-if="props.loading">處理中...</span>
          <span v-else>{{ props.confirmText }}</span>
        </button>
      </div>
    </template>
  </el-dialog>
</template>
