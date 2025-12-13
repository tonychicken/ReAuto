<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="emit('update:open', false)"
      >
        <div class="flex h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
          <!-- 左側：產品介紹 -->
          <div class="hidden lg:flex w-1/2 flex-col border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <div class="flex-1 overflow-y-auto p-8">
              <!-- 上半部：產品特點 -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {{ registerType === "enterprise" ? "企業版功能" : "個人版功能" }}
                </h2>
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        車輛全生命週期管理
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        從收購、整備、上架到售出，完整追蹤每一台車的狀態
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        成本利潤即時計算
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        自動累加收購價、維修費、美容費，即時查看毛利淨利
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        多倉庫據點管理
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        支援多個倉庫據點，車輛調撥、庫存查詢一目了然
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        維修服務廠管理
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        整合維修、美容、驗車等服務廠，報價比價更輕鬆
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        文件圖片雲端儲存
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        美容前後對比、認證證書、完稅證明一鍵上傳保存
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 下半部：試用權限 -->
              <div class="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  🎁 試用期間享有權限
                </h3>
                <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li class="flex items-center gap-2">
                    <span class="text-blue-600 dark:text-blue-400">•</span>
                    所有核心功能完全開放
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-blue-600 dark:text-blue-400">•</span>
                    無限制車輛數量管理
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-blue-600 dark:text-blue-400">•</span>
                    無限制使用者帳號
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-blue-600 dark:text-blue-400">•</span>
                    完整技術支援服務
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-blue-600 dark:text-blue-400">•</span>
                    試用期間完全免費
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 右側：註冊表單 -->
          <div class="flex flex-1 flex-col overflow-y-auto">
            <div class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {{ registerType === "enterprise" ? "企業註冊" : "個人註冊" }}
              </h2>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition"
                @click="emit('update:open', false)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 p-6">
              <!-- 手機驗證步驟 -->
              <div v-if="step === 'phone'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    輸入手機號碼
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    我們將發送驗證碼到您的手機
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      手機號碼
                    </label>
                    <input
                      v-model="phoneForm.phone"
                      type="tel"
                      placeholder="0912-345-678"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @keyup.enter="sendVerificationCode"
                    />
                  </div>

                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="loading || !phoneForm.phone"
                    @click="sendVerificationCode"
                  >
                    {{ loading ? "發送中..." : "發送驗證碼" }}
                  </button>
                </div>
              </div>

              <!-- 驗證碼步驟 -->
              <div v-else-if="step === 'verify'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    輸入驗證碼
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    已發送驗證碼至 {{ phoneForm.phone }}
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      驗證碼
                    </label>
                    <input
                      v-model="phoneForm.code"
                      type="text"
                      placeholder="請輸入 6 位數驗證碼"
                      maxlength="6"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 text-center text-2xl tracking-widest outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @keyup.enter="verifyCode"
                    />
                  </div>

                  <div class="flex items-center justify-between">
                    <button
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      @click="sendVerificationCode"
                    >
                      重新發送驗證碼
                    </button>
                    <button
                      type="button"
                      class="text-sm text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      @click="step = 'phone'"
                    >
                      返回修改手機
                    </button>
                  </div>

                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="loading || phoneForm.code.length !== 6"
                    @click="verifyCode"
                  >
                    {{ loading ? "驗證中..." : "驗證" }}
                  </button>
                </div>
              </div>

              <!-- 帳號設定步驟 -->
              <div v-else-if="step === 'account'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    設定帳號密碼
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    或使用 Google 快速登入
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      電子郵件
                    </label>
                    <input
                      v-model="accountForm.email"
                      type="email"
                      placeholder="your@email.com"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      密碼
                    </label>
                    <input
                      v-model="accountForm.password"
                      type="password"
                      placeholder="至少 6 個字元"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      確認密碼
                    </label>
                    <input
                      v-model="accountForm.passwordConfirm"
                      type="password"
                      placeholder="再次輸入密碼"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                      <span class="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                        或
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    @click="handleGoogleLogin"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    使用 Google 登入
                  </button>

                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="loading || !accountForm.email || !accountForm.password || accountForm.password !== accountForm.passwordConfirm"
                    @click="createAccount"
                  >
                    {{ loading ? "建立中..." : "建立帳號" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { supabaseClient } from "@core";

interface Props {
  open: boolean;
  registerType: "enterprise" | "individual";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "register-success"): void;
}>();

const router = useRouter();

const step = ref<"phone" | "verify" | "account">("phone");
const loading = ref(false);

const phoneForm = ref({
  phone: "",
  code: ""
});

const accountForm = ref({
  email: "",
  password: "",
  passwordConfirm: ""
});

watch(() => props.open, (newVal) => {
  if (newVal) {
    step.value = "phone";
    phoneForm.value = { phone: "", code: "" };
    accountForm.value = { email: "", password: "", passwordConfirm: "" };
  }
});

async function sendVerificationCode() {
  if (!phoneForm.value.phone) {
    return;
  }

  loading.value = true;
  try {
    // TODO: 實作發送驗證碼 API
    // 這裡先模擬成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    step.value = "verify";
  } catch (error) {
    console.error("發送驗證碼失敗", error);
  } finally {
    loading.value = false;
  }
}

async function verifyCode() {
  if (phoneForm.value.code.length !== 6) {
    return;
  }

  loading.value = true;
  try {
    // TODO: 實作驗證碼驗證 API
    // 這裡先模擬成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    step.value = "account";
  } catch (error) {
    console.error("驗證碼錯誤", error);
  } finally {
    loading.value = false;
  }
}

async function createAccount() {
  if (accountForm.value.password !== accountForm.value.passwordConfirm) {
    return;
  }

  loading.value = true;
  try {
    // 建立帳號
    const { data, error } = await supabaseClient.auth.signUp({
      email: accountForm.value.email,
      password: accountForm.value.password,
      options: {
        data: {
          phone: phoneForm.value.phone
        }
      }
    });

    if (error) {
      throw error;
    }

    // 建立 profile
    if (data.user) {
      await supabaseClient.from("profiles").insert({
        id: data.user.id,
        phone: phoneForm.value.phone
      });
    }

    // 導向介紹頁面
    emit("register-success");
    router.push({
      name: "onboarding",
      query: {
        phone: phoneForm.value.phone,
        email: accountForm.value.email
      }
    });
  } catch (error: any) {
    console.error("建立帳號失敗", error);
    alert(error?.message || "建立帳號失敗");
  } finally {
    loading.value = false;
  }
}

async function handleGoogleLogin() {
  loading.value = true;
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?onboarding=true`
      }
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error("Google 登入失敗", error);
    alert(error?.message || "Google 登入失敗");
    loading.value = false;
  }
}
</script>

