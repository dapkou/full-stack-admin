<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { login } from "@/stores/auth";
import AuthSidePanel from "@/views/auth/components/AuthSidePanel.vue";
import Header from "@/layouts/Header.vue";
import { useTheme } from "@/stores/theme";
import type { ApiError } from "@/api/http";

const { isDark, toggleTheme } = useTheme();
const router = useRouter();

const loading = ref(false);
const error = ref("");

const formRef = ref<FormInstance>();

const form = reactive({
  email: "",
  password: "",
});

const rules: FormRules<typeof form> = {
  email: [
    { required: true, message: "請輸入 Email", trigger: "blur" },
    { type: "email", message: "Email 格式不正確", trigger: ["blur", "change"] },
  ],
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { min: 6, message: "密碼至少 6 碼", trigger: "blur" },
  ],
};

watch(
  () => [form.email, form.password],
  () => {
    if (error.value) error.value = "";
  },
);

async function onSubmit() {
  error.value = "";

  const ok = await formRef.value?.validate().catch(() => false);
  if (!ok) return;

  loading.value = true;
  try {
    await login(form.email.trim(), form.password);

    await router.replace({ name: "dashboard" });
  } catch (e: unknown) {
    const status = Number((e as ApiError | any)?.status ?? 0);
    if (status === 401) {
      error.value = "帳號或密碼不正確";
    } else {
      error.value = "系統忙碌中，請稍後再試";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Header variant="auth" :isDark="isDark" :toggleTheme="toggleTheme" />

  <div
    class="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden"
  >
    <AuthSidePanel />

    <section
      class="relative flex lg:w-1/2 flex-col justify-center items-center px-6 bg-surface overflow-y-auto"
    >
      <div class="w-full max-w-[480px] space-y-8 my-auto">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">歡迎回來</h2>
          <p class="text-muted-foreground">請輸入帳號資訊以登入系統</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="mt-8 space-y-6"
          @submit.prevent="onSubmit"
        >
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="name@example.com"
              size="large"
              @keyup.enter="onSubmit"
            />
          </el-form-item>

          <el-form-item label="密碼" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              autocomplete="current-password"
              placeholder="請輸入密碼"
              size="large"
              @keyup.enter="onSubmit"
            />
          </el-form-item>

          <!-- 登入失敗（後端回應） -->
          <div
            v-if="error"
            class="rounded-lg border border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? "登入中..." : "登入" }}
          </button>

          <div class="pt-4 text-center text-sm text-muted-foreground">
            還沒有帳號？
            <button
              type="button"
              class="font-semibold text-foreground underline underline-offset-4 hover:opacity-70"
              @click="router.push('/register')"
            >
              立即註冊
            </button>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>
