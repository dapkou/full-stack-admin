<script setup lang="ts">
import { computed, useSlots } from "vue";

type Props = {
  title?: string;
  subtitle?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "muted";
  bodyClass?: string;
  headerClass?: string;
  cardClass?: string;
};

const props = withDefaults(defineProps<Props>(), {
  padding: "md",
  bodyClass: "",
  headerClass: "",
  cardClass: "",
});

const slots = useSlots();

const paddingSettings = computed(() => {
  switch (props.padding) {
    case "none":
      return { body: "!p-0", header: "!px-0 !py-0" };
    case "sm":
      return { body: "!p-3", header: "!px-3 !py-3" };
    case "lg":
      return { body: "!p-6", header: "!px-6 !py-5" };
    default:
      return { body: "!p-5", header: "!px-5 !py-4" };
  }
});

const cardStyle = computed(() => {
  if (props.variant === "muted") {
    return {
      "--el-card-bg-color": "hsl(var(--muted))",
      "--el-text-color-muted": "white",
    };
  }
  return {};
});

const variantClass = computed(() =>
  props.variant === "muted" ? "app-card--muted" : "app-card--default",
);

const hasHeaderText = computed(() => !!(props.title || props.subtitle));
const hasActions = computed(() => !!slots.actions);
</script>

<template>
  <!-- <el-card
    :style="cardStyle"
    :class="['app-card', props.cardClass]"
   
  > -->
  <el-card
    :style="cardStyle"
    :class="['app-card', variantClass, props.cardClass]"
    :header-class="[
      'app-card__header',
      paddingSettings.header,
      props.headerClass,
    ]"
    :body-class="['app-card__body', paddingSettings.body, props.bodyClass]"
    shadow="always"
  >
    <template v-if="hasHeaderText || hasActions" #header>
      <div class="flex items-center justify-between gap-4">
        <div v-if="hasHeaderText" class="min-w-0">
          <div
            v-if="title"
            class="text-lg font-semibold text-foreground truncate"
          >
            {{ title }}
          </div>
          <div v-if="subtitle" class="text-sm text-muted-foreground mt-1">
            {{ subtitle }}
          </div>
        </div>

        <div v-if="hasActions" class="shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </template>

    <slot />
  </el-card>
</template>
