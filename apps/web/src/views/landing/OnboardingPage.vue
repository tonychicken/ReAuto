<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
      <!-- 進度指示器 -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="flex-1"
          >
            <div
              class="h-2 rounded-full transition-all duration-500"
              :class="
                index < currentSlide
                  ? 'bg-blue-600'
                  : index === currentSlide
                    ? 'bg-blue-400'
                    : 'bg-slate-200 dark:bg-slate-700'
              "
            />
          </div>
        </div>
        <div class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {{ currentSlide + 1 }} / {{ slides.length }}
        </div>
      </div>

      <!-- 內容區域 -->
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          :key="currentSlide"
          class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 md:p-12 shadow-xl min-h-[500px] flex flex-col items-center justify-center text-center"
        >
          <!-- Slide 1: 歡迎 -->
          <div v-if="currentSlide === 0" class="space-y-6 animate-fade-in">
            <div class="mx-auto h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center mb-6 animate-bounce">
              <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
              歡迎使用 ReAuto！
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              您已成功註冊，接下來讓我們快速了解系統的主要功能
            </p>
          </div>

          <!-- Slide 2: 車輛管理 -->
          <div v-else-if="currentSlide === 1" class="space-y-6 animate-fade-in">
            <div class="mx-auto h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-pulse">
              <svg class="h-12 w-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
              🚗 車輛全生命週期管理
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              從收購、整備、上架到售出，每一台車的狀態、成本、利潤都清晰可見
            </p>
            <div class="mt-8 grid grid-cols-3 gap-4 max-w-2xl">
              <div class="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                <div class="text-2xl mb-2">📥</div>
                <div class="text-sm font-medium text-slate-900 dark:text-slate-100">收購</div>
              </div>
              <div class="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                <div class="text-2xl mb-2">🔧</div>
                <div class="text-sm font-medium text-slate-900 dark:text-slate-100">整備</div>
              </div>
              <div class="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                <div class="text-2xl mb-2">💰</div>
                <div class="text-sm font-medium text-slate-900 dark:text-slate-100">售出</div>
              </div>
            </div>
          </div>

          <!-- Slide 3: 成本利潤 -->
          <div v-else-if="currentSlide === 2" class="space-y-6 animate-fade-in">
            <div class="mx-auto h-24 w-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-6 animate-pulse">
              <svg class="h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
              💰 成本利潤即時計算
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              收購價、維修費、美容費自動累加，售出後成本鎖定，毛利淨利一目了然
            </p>
            <div class="mt-8 max-w-md mx-auto">
              <div class="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-slate-600 dark:text-slate-400">收購價</span>
                  <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">$500,000</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-slate-600 dark:text-slate-400">維修費</span>
                  <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">$30,000</span>
                </div>
                <div class="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">總成本</span>
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">$530,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 4: 智能標籤 -->
          <div v-else-if="currentSlide === 3" class="space-y-6 animate-fade-in">
            <div class="mx-auto h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 animate-pulse">
              <svg class="h-12 w-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
              📋 智能狀態標籤系統
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              自動偵測車輛整備狀態，未美容、缺證明、需維修一目了然，避免遺漏重要步驟
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span class="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-800 dark:text-orange-300">
                ⚠️ 未美容
              </span>
              <span class="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm font-medium text-red-800 dark:text-red-300">
                🔧 需維修
              </span>
              <span class="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">
                📄 缺證明
              </span>
              <span class="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-300">
                ✅ 整備完成
              </span>
            </div>
          </div>

          <!-- Slide 5: 開始體驗 -->
          <div v-else-if="currentSlide === 4" class="space-y-6 animate-fade-in">
            <div class="mx-auto h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center mb-6 animate-bounce">
              <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
              準備開始了嗎？
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              現在您可以開始使用 ReAuto 管理您的車輛庫存了！
            </p>

            <!-- 登入表單 -->
            <div class="mt-8 w-full max-w-md mx-auto">
              <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
                <div v-if="isGoogleLoggedIn" class="text-center">
                  <div class="mb-4">
                    <div class="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-slate-600 dark:text-slate-400 mb-4">
                    您已使用 Google 登入
                  </p>
                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                    @click="goToDashboard"
                  >
                    進入系統
                  </button>
                </div>

                <div v-else class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      電子郵件
                    </label>
                    <input
                      v-model="loginForm.email"
                      type="email"
                      placeholder="your@email.com"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      密碼
                    </label>
                    <input
                      v-model="loginForm.password"
                      type="password"
                      placeholder="••••••••"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @keyup.enter="handleLogin"
                    />
                  </div>

                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    :disabled="loading || !loginForm.email || !loginForm.password"
                    @click="handleLogin"
                  >
                    {{ loading ? "登入中..." : "開始體驗" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 下一步按鈕 -->
      <div class="mt-8 flex items-center justify-center">
        <Transition
          enter-active-class="transition-all duration-500 delay-1000"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <button
            v-if="currentSlide < slides.length - 1 && showNextButton"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="nextSlide"
          >
            下一步
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabaseClient } from "@core";
import { initAuth } from "@core";

const router = useRouter();
const route = useRoute();

const currentSlide = ref(0);
const showNextButton = ref(false);
const loading = ref(false);
const isGoogleLoggedIn = ref(false);

const loginForm = ref({
  email: (route.query.email as string) || "",
  password: ""
});

const slides = [
  { id: "welcome" },
  { id: "vehicle" },
  { id: "profit" },
  { id: "tags" },
  { id: "start" }
];

// 檢查是否已登入
onMounted(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    isGoogleLoggedIn.value = true;
    // 如果已登入且是最後一頁，自動跳轉
    if (currentSlide.value === slides.length - 1) {
      await goToDashboard();
    }
  }

  // 1 秒後顯示下一步按鈕
  setTimeout(() => {
    showNextButton.value = true;
  }, 1000);
});

function nextSlide() {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++;
    showNextButton.value = false;
    // 每次切換後 1 秒顯示按鈕
    setTimeout(() => {
      showNextButton.value = true;
    }, 1000);
  }
}

async function handleLogin() {
  loading.value = true;
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    if (error) {
      throw error;
    }

    await initAuth();
    await goToDashboard();
  } catch (error: any) {
    alert(error?.message || "登入失敗，請檢查您的帳號密碼");
  } finally {
    loading.value = false;
  }
}

async function goToDashboard() {
  await router.push("/");
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>

