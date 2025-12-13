<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
        <!-- Logo / Title -->
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            重設密碼
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            請輸入您的新密碼
          </p>
        </div>

        <!-- Error / Success Message -->
        <div
          v-if="error"
          class="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400"
        >
          {{ error }}
        </div>
        <div
          v-if="successMessage"
          class="mb-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400"
        >
          {{ successMessage }}
        </div>

        <!-- Reset Password Form -->
        <form
          class="space-y-4"
          @submit.prevent="handleResetPassword"
        >
          <div>
            <label
              for="new-password"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              新密碼 <span class="text-red-500">*</span>
            </label>
            <input
              id="new-password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              minlength="6"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="至少 6 個字元"
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              確認新密碼 <span class="text-red-500">*</span>
            </label>
            <input
              id="confirm-password"
              v-model="form.passwordConfirm"
              type="password"
              required
              autocomplete="new-password"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="再次輸入新密碼"
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "處理中..." : "重設密碼" }}
          </button>

          <button
            type="button"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
            @click="router.push('/login')"
          >
            返回登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabaseClient } from "@core";

const router = useRouter();

const form = ref({
  password: "",
  passwordConfirm: ""
});

const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

onMounted(async () => {
  // 檢查是否有有效的 session（從重設密碼連結來的）
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    error.value = "無效的重設密碼連結，請重新申請";
  }
});

async function handleResetPassword() {
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = "密碼與確認密碼不一致";
    return;
  }

  if (form.value.password.length < 6) {
    error.value = "密碼至少需要 6 個字元";
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: form.value.password
    });

    if (updateError) {
      throw updateError;
    }

    successMessage.value = "密碼重設成功！正在導向登入頁面...";

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (e: any) {
    error.value = e?.message ?? "重設密碼失敗，請稍後再試";
  } finally {
    loading.value = false;
  }
}
</script>

