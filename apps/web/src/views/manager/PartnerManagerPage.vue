<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-app-text-primary">
          維修 / 服務廠管理
        </h2>
        <p class="mt-1 text-sm text-app-text-secondary">
          管理合作的維修廠、美容廠、驗車廠等，對應 Supabase 的
          <code class="rounded bg-app-muted px-1 py-0.5 text-xs text-app-text-primary">partners</code> 資料表。
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50"
        :disabled="showForm"
        @click="openForm"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        新增服務廠
      </button>
    </header>

    <!-- Form Dialog -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <div class="w-full max-w-2xl rounded-xl border border-app-border bg-app-surface p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-app-text-primary">
              {{ editingId ? "編輯服務廠" : "新增服務廠" }}
            </h3>
            <button
              type="button"
              class="rounded-lg p-1.5 text-app-text-muted hover:bg-app-muted hover:text-app-text-primary"
              @click="closeForm"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form
            class="grid gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
          >
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                店家名稱 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="例如：XX 維修廠"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                類型
              </label>
              <select
                v-model="form.type"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              >
                <option value="">
                  未指定
                </option>
                <option value="repair_shop">
                  維修廠
                </option>
                <option value="detailing">
                  美容廠
                </option>
                <option value="inspection">
                  驗車站
                </option>
                <option value="tire">
                  輪胎店
                </option>
                <option value="other">
                  其他
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                聯絡人
              </label>
              <input
                v-model="form.contact_name"
                type="text"
                placeholder="聯絡人姓名"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                聯絡電話
              </label>
              <input
                v-model="form.contact_phone"
                type="text"
                placeholder="電話"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="submitting"
              >
                <svg
                  v-if="submitting"
                  class="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ submitting ? "處理中..." : editingId ? "儲存變更" : "新增服務廠" }}
              </button>
              <button
                type="button"
                class="rounded-lg border border-app-border px-5 py-2.5 text-sm font-medium text-app-text-primary transition hover:bg-app-muted"
                @click="closeForm"
              >
                取消
              </button>
            </div>

            <div
              v-if="error"
              class="md:col-span-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400"
            >
              {{ error }}
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- List Section -->
    <section class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
      <div v-if="loading" class="text-sm text-app-text-muted">
        載入中…
      </div>
      <table
        v-else
        class="min-w-full text-left text-sm text-app-text-primary"
      >
        <thead class="border-b border-app-border text-xs uppercase text-app-text-muted">
          <tr>
            <th class="py-2 pr-4">
              名稱
            </th>
            <th class="py-2 pr-4">
              類型
            </th>
            <th class="py-2 pr-4">
              聯絡人
            </th>
            <th class="py-2 pr-4">
              電話
            </th>
            <th class="py-2 pr-4">
              建立時間
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="partners.length === 0">
            <td
              colspan="5"
              class="py-3 text-sm text-app-text-muted"
            >
              尚無資料，先點右上角「新增服務廠」。
            </td>
          </tr>
          <tr
            v-for="p in partners"
            :key="p.id"
            class="border-t border-app-border hover:bg-app-muted transition"
          >
            <td class="py-2 pr-4 font-medium text-app-text-primary">
              {{ p.name }}
            </td>
            <td class="py-2 pr-4">
              {{ typeLabel(p.type) }}
            </td>
            <td class="py-2 pr-4">
              {{ p.contact_name || "—" }}
            </td>
            <td class="py-2 pr-4">
              {{ p.contact_phone || "—" }}
            </td>
            <td class="py-2 pr-4 text-xs text-app-text-muted">
              {{ new Date(p.created_at).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Partner } from "@core";
import { partnerManager } from "@core";

const partners = ref<Partner[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  name: "",
  type: "",
  contact_name: "",
  contact_phone: ""
});

function resetForm() {
  form.name = "";
  form.type = "";
  form.contact_name = "";
  form.contact_phone = "";
  editingId.value = null;
}

function openForm() {
  resetForm();
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  resetForm();
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    partners.value = await partnerManager.list();
  } catch (e: any) {
    error.value = e?.message ?? "載入失敗";
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (!form.name.trim()) return;
  submitting.value = true;
  error.value = null;
  try {
    if (editingId.value) {
      const updated = await partnerManager.update(editingId.value, {
        name: form.name.trim(),
        type: form.type || undefined,
        contact_name: form.contact_name.trim() || undefined,
        contact_phone: form.contact_phone.trim() || undefined
      });
      partners.value = partners.value.map((p: Partner) =>
        p.id === updated.id ? updated : p
      );
    } else {
      const created = await partnerManager.create({
        name: form.name.trim(),
        type: form.type || undefined,
        contact_name: form.contact_name.trim() || undefined,
        contact_phone: form.contact_phone.trim() || undefined
      });
      partners.value = [created, ...partners.value];
    }
    closeForm();
  } catch (e: any) {
    error.value = e?.message ?? "儲存失敗";
  } finally {
    submitting.value = false;
  }
}

function typeLabel(type: string | null): string {
  switch (type) {
    case "repair_shop":
      return "維修廠";
    case "detailing":
      return "美容廠";
    case "inspection":
      return "驗車站";
    case "tire":
      return "輪胎店";
    case "other":
      return "其他";
    default:
      return "未指定";
  }
}

onMounted(load);
</script>

