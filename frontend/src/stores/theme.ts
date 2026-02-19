import { ref, watchEffect } from "vue";

const isDark = ref(false);

// 初始化（讀 localStorage 或系統偏好）
const saved = localStorage.getItem("theme");
if (saved === "dark") isDark.value = true;
else if (saved === "light") isDark.value = false;
else isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;

// 同步到 html
watchEffect(() => {
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
});

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return { isDark, toggleTheme };
}
