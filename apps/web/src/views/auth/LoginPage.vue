<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
        <!-- Logo / Title -->
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            車商庫存管理平台
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {{ showSignUp ? "建立新帳號" : showForgotPassword ? "重設密碼" : "請登入以繼續使用" }}
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

        <!-- 忘記密碼頁面 -->
        <div v-if="showForgotPassword">
          <form
            class="space-y-4"
            @submit.prevent="handleForgotPassword"
          >
            <div>
              <label
                for="reset-email"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                電子郵件
              </label>
              <input
                id="reset-email"
                v-model="forgotPasswordForm.email"
                type="email"
                required
                autocomplete="email"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? "發送中..." : "發送重設密碼連結" }}
            </button>

            <button
              type="button"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              @click="showForgotPassword = false"
            >
              返回登入
            </button>
          </form>
        </div>

        <!-- 註冊表單 -->
        <div v-else-if="showSignUp">
          <form
            class="space-y-4"
            @submit.prevent="handleSignUp"
          >
            <div>
              <label
                for="signup-email"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                電子郵件 <span class="text-red-500">*</span>
              </label>
              <input
                id="signup-email"
                v-model="signUpForm.email"
                type="email"
                required
                autocomplete="email"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                for="signup-password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                密碼 <span class="text-red-500">*</span>
              </label>
              <input
                id="signup-password"
                v-model="signUpForm.password"
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
                for="signup-password-confirm"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                確認密碼 <span class="text-red-500">*</span>
              </label>
              <input
                id="signup-password-confirm"
                v-model="signUpForm.passwordConfirm"
                type="password"
                required
                autocomplete="new-password"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="再次輸入密碼"
              />
            </div>

            <div>
              <label
                for="signup-display-name"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                顯示名稱（選填）
              </label>
              <input
                id="signup-display-name"
                v-model="signUpForm.displayName"
                type="text"
                autocomplete="name"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="例如：王小明"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? "註冊中..." : "註冊" }}
            </button>

            <button
              type="button"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              @click="showSignUp = false"
            >
              返回登入
            </button>
          </form>
        </div>

        <!-- 登入表單 -->
        <div v-else>
          <form
            class="space-y-4"
            @submit.prevent="handleLogin"
          >
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                電子郵件
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                密碼
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="••••••••"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500"
                >
                <span>記住我</span>
              </label>
              <button
                type="button"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                @click="showForgotPassword = true"
              >
                忘記密碼？
              </button>
            </div>

            <button
              type="submit"
              class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? "登入中..." : "登入" }}
            </button>
          </form>

        <!-- Google 登入按鈕 -->
        <div class="mt-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-300" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-2 text-slate-500">
                或
              </span>
            </div>
          </div>

          <button
            type="button"
            class="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="loading"
            @click="handleGoogleLogin"
          >
            <!-- Google 彩色 Logo -->
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span class="text-slate-700">使用 Google 登入</span>
          </button>
        </div>
        </div>

        <!-- Sign Up Link (只在登入頁面顯示) -->
        <div
          v-if="!showSignUp && !showForgotPassword"
          class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400"
        >
          還沒有帳號？
          <button
            type="button"
            class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            @click="showSignUp = true"
          >
            立即註冊
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabaseClient } from "@core";
import { initAuth } from "@core";

const router = useRouter();
const route = useRoute();

const form = ref({
  email: "",
  password: "",
  remember: false
});

const signUpForm = ref({
  email: "",
  password: "",
  passwordConfirm: "",
  displayName: ""
});

const forgotPasswordForm = ref({
  email: ""
});

const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const showSignUp = ref(false);
const showForgotPassword = ref(false);

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    });

    if (authError) {
      throw authError;
    }

      // 初始化認證狀態
      await initAuth();

      // 檢查是否有 redirect query 參數，有的話導向該頁面，否則導向首頁
      const redirect = route.query.redirect as string;
      router.push(redirect || "/");
  } catch (e: any) {
    error.value = e?.message ?? "登入失敗，請檢查您的帳號密碼";
  } finally {
    loading.value = false;
  }
}

async function handleSignUp() {
  if (signUpForm.value.password !== signUpForm.value.passwordConfirm) {
    error.value = "密碼與確認密碼不一致";
    return;
  }

  if (signUpForm.value.password.length < 6) {
    error.value = "密碼至少需要 6 個字元";
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    // 1. 註冊用戶
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      options: {
        data: {
          display_name: signUpForm.value.displayName || null
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("註冊失敗");
    }

    // 2. 建立 profile（如果註冊成功）
    if (authData.user) {
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert({
          id: authData.user.id,
          display_name: signUpForm.value.displayName || null
        });

      if (profileError) {
        console.error("建立 profile 失敗", profileError);
        // 不阻擋註冊流程，profile 可以在之後補上
      }
    }

    successMessage.value = "註冊成功！請檢查您的電子郵件以驗證帳號。";
    
    // 清空表單
    signUpForm.value = {
      email: "",
      password: "",
      passwordConfirm: "",
      displayName: ""
    };

    // 3 秒後切換回登入頁面
    setTimeout(() => {
      showSignUp.value = false;
      successMessage.value = null;
    }, 3000);
  } catch (e: any) {
    error.value = e?.message ?? "註冊失敗，請稍後再試";
  } finally {
    loading.value = false;
  }
}

async function handleForgotPassword() {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(
      forgotPasswordForm.value.email,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    );

    if (resetError) {
      throw resetError;
    }

    successMessage.value = "重設密碼連結已發送到您的電子郵件，請檢查收件匣。";
    forgotPasswordForm.value.email = "";

    // 3 秒後切換回登入頁面
    setTimeout(() => {
      showForgotPassword.value = false;
      successMessage.value = null;
    }, 3000);
  } catch (e: any) {
    error.value = e?.message ?? "發送失敗，請稍後再試";
  } finally {
    loading.value = false;
  }
}

async function handleGoogleLogin() {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const { error: oauthError } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (oauthError) {
      // 檢查是否是 provider 未啟用的錯誤
      if (oauthError.message?.includes("not enabled") || oauthError.message?.includes("Unsupported provider")) {
        error.value = "Google 登入功能尚未啟用。請在 Supabase Dashboard → Authentication → Providers 中啟用 Google Provider 並填入 Client ID 和 Client Secret。";
      } else {
        throw oauthError;
      }
      loading.value = false;
      return;
    }
    // OAuth 會自動跳轉，不需要手動處理
  } catch (e: any) {
    error.value = e?.message ?? "Google 登入失敗，請稍後再試";
    loading.value = false;
  }
}
</script>

