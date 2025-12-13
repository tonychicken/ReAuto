<template>
  <div class="flex min-h-screen items-center justify-center bg-app-bg px-4 py-12">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-app-text-primary">
          設定測試租戶
        </h1>
        <p class="mt-2 text-sm text-app-text-secondary">
          為了測試功能，請先建立一個測試租戶
        </p>
      </div>

      <div class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
        <form
          class="space-y-4"
          @submit.prevent="handleCreateTenant"
        >
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-app-text-primary">
              租戶名稱 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="例如：測試車商"
              class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-app-text-primary">
              方案類型
            </label>
            <select
              v-model="form.plan_type"
              class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            >
              <option value="free">
                免費版
              </option>
              <option value="standard">
                標準版
              </option>
              <option value="pro">
                專業版
              </option>
            </select>
          </div>

          <div
            v-if="error"
            class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="submitting"
          >
            <span v-if="submitting">建立中...</span>
            <span v-else>建立測試租戶</span>
          </button>
        </form>
      </div>

      <div class="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
        <p class="text-xs text-blue-700 dark:text-blue-300">
          <strong>提示：</strong>如果你已經在 Supabase 建立了租戶和 tenant_member，請重新整理頁面或登出後重新登入。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { supabaseClient } from "@core";
import { useAuth } from "@/composables/useAuth";
import { tenantManager } from "@core";

const router = useRouter();
const { user, refreshAuth } = useAuth();

const form = reactive<{
  name: string;
  plan_type: "free" | "standard" | "pro";
}>({
  name: "測試車商",
  plan_type: "free"
});

const submitting = ref(false);
const error = ref<string | null>(null);

async function handleCreateTenant() {
  if (!user.value) {
    error.value = "請先登入";
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    // 1. 建立租戶
    const tenant = await tenantManager.create({
      name: form.name.trim(),
      plan_type: form.plan_type,
      status: "active"
    });

    // 2. 建立 tenant_member（將當前用戶加入租戶，角色為 owner）
    const { error: memberError } = await supabaseClient
      .from("tenant_members")
      .insert({
        tenant_id: tenant.id,
        user_id: user.value.id,
        role: "owner",
        status: "active"
      });

    if (memberError) {
      throw memberError;
    }

    // 3. 重新整理認證狀態
    await refreshAuth();

    // 4. 導向到首頁
    router.push("/inventory");
  } catch (e: any) {
    console.error("建立租戶失敗", e);
    error.value = e?.message ?? "建立租戶失敗，請稍後再試";
  } finally {
    submitting.value = false;
  }
}
</script>

