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
          <!-- 左側：產品介紹 + 個人/企業頁籤 -->
          <div class="hidden lg:flex w-1/2 flex-col border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <div class="flex-1 overflow-y-auto p-8">
              <!-- 方案頁籤 -->
              <div class="mb-6 flex rounded-xl bg-white/70 dark:bg-slate-900/40 p-1">
                <button
                  type="button"
                  class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
                  :class="localRegisterType === 'individual'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'"
                  @click="localRegisterType = 'individual'"
                >
                  個人版
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
                  :class="localRegisterType === 'enterprise'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'"
                  @click="localRegisterType = 'enterprise'"
                >
                  企業版
                </button>
              </div>

              <!-- 上半部：產品特點 -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {{ localRegisterType === "enterprise" ? "企業版功能" : "個人版功能" }}
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
                  <div
                    v-if="localRegisterType === 'enterprise'"
                    class="flex items-start gap-3"
                  >
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      ✓
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        專屬子域名與團隊協作
                      </h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        企業版支援專屬登入網址與多使用者協作，對應你現在的子網域多租戶設計。
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
                免費立即體驗
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
              <!-- 註冊方式頁籤 -->
              <div class="mb-6 flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-1">
                <button
                  type="button"
                  class="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition"
                  :class="registerMethod === 'phone'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
                  @click="switchRegisterMethod('phone')"
                >
                  手機註冊
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition"
                  :class="registerMethod === 'email'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
                  @click="switchRegisterMethod('email')"
                >
                  Email 註冊
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  @click="handleGoogleLogin"
                >
                  Google 登入
                </button>
              </div>

              <!-- 手機 / Email 輸入步驟 -->
              <div v-if="step === 'input'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {{ registerMethod === "phone" ? "輸入手機號碼" : "輸入電子郵件" }}
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    我們將發送驗證碼到您的{{ registerMethod === "phone" ? "手機" : "電子郵件" }}
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ registerMethod === "phone" ? "手機號碼" : "電子郵件" }}
                    </label>
                    <input
                      v-if="registerMethod === 'phone'"
                      v-model="phoneForm.phone"
                      type="tel"
                      placeholder="0912-345-678"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @keyup.enter="sendVerificationCode"
                    />
                    <input
                      v-else
                      v-model="emailInput"
                      type="email"
                      placeholder="your@email.com"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @keyup.enter="sendVerificationCode"
                    />
                  </div>

                  <button
                    type="button"
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    :disabled="loading || (registerMethod === 'phone' ? !phoneForm.phone : !emailInput)"
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
                    已發送驗證碼至 {{ registerMethod === "phone" ? phoneForm.phone : emailInput }}
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
                      @click="step = 'input'"
                    >
                      返回修改{{ registerMethod === "phone" ? "手機" : "Email" }}
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
                    已通過 {{ registerMethod === "phone" ? "手機" : "Email" }} 驗證，請設定登入帳號。
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
                      :readonly="registerMethod === 'email'"
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
                    <div class="absolute inset-0 flex items-center pointer-events-none">
                      <div class="w-full border-t border-dashed border-slate-300 dark:border-slate-600" />
                    </div>
                    <div class="relative flex justify-center text-xs uppercase text-slate-500 dark:text-slate-400">
                      只需一步即可建立帳號
                    </div>
                  </div>

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

// 左側：本地方案狀態（個人 / 企業）
const localRegisterType = ref<"enterprise" | "individual">(props.registerType);

// 右側：註冊方式與步驟
type RegisterMethod = "phone" | "email";
type RegisterStep = "input" | "verify" | "account";

const registerMethod = ref<RegisterMethod>("phone");
const step = ref<RegisterStep>("input");
const loading = ref(false);

const phoneForm = ref({
  phone: "",
  code: ""
});

const emailInput = ref("");

const accountForm = ref({
  email: "",
  password: "",
  passwordConfirm: ""
});

watch(() => props.open, (newVal) => {
  if (newVal) {
    // dialog 打開時重置狀態
    localRegisterType.value = props.registerType;
    registerMethod.value = "phone";
    step.value = "input";
    phoneForm.value = { phone: "", code: "" };
    emailInput.value = "";
    accountForm.value = { email: "", password: "", passwordConfirm: "" };
  }
});

function switchRegisterMethod(method: RegisterMethod) {
  if (registerMethod.value === method) return;
  registerMethod.value = method;
  step.value = "input";
  phoneForm.value = { phone: "", code: "" };
  emailInput.value = "";
}

async function sendVerificationCode() {
  if (registerMethod.value === "phone" && !phoneForm.value.phone) return;
  if (registerMethod.value === "email" && !emailInput.value) return;

  loading.value = true;
  try {
    // TODO: 實作實際簡訊 / Email 驗證碼 API
    // 目前先用延遲模擬成功
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
    // TODO: 實作驗證碼驗證 API（依據手機或 Email）
    // 目前先用延遲模擬成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    step.value = "account";
    if (registerMethod.value === "email") {
      accountForm.value.email = emailInput.value;
    }
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
          phone: registerMethod.value === "phone" ? phoneForm.value.phone : null
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
        phone: registerMethod.value === "phone" ? phoneForm.value.phone : null
      });
    }

    // 嘗試直接登入（開發 / Demo 模式）
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: accountForm.value.email,
      password: accountForm.value.password
    });

    if (signInError) {
      // 自動登入失敗不阻擋後續流程，使用者仍可在 Onboarding 中手動登入
      console.error("自動登入失敗", signInError);
    }

    // 導向介紹頁面
    emit("register-success");
    router.push({
      name: "onboarding",
      query: {
        phone: registerMethod.value === "phone" ? phoneForm.value.phone : undefined,
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

