<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-app-text-primary">
          車輛主檔管理
        </h2>
        <p class="mt-1 text-sm text-app-text-secondary">
          管理車輛基本資料，對應 Supabase 的
          <code class="rounded bg-app-muted px-1 py-0.5 text-xs text-app-text-primary">vehicles</code> 資料表。
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
        新增車輛
      </button>
    </header>

    <!-- Form Section（跟倉庫一樣的展開樣式） -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <section
        v-if="showForm"
        class="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-app-text-primary">
            {{ editingId ? "編輯車輛" : "新增車輛" }}
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
              廠牌 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.make"
              type="text"
              required
              placeholder="例如：Toyota"
              class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-app-text-primary">
              車系 / 車型 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              required
              placeholder="例如：Altis"
              class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-app-text-primary">
              年份（選填）
            </label>
            <input
              v-model.number="form.year"
              type="number"
              min="1970"
              max="2100"
              class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-app-text-primary">
              顏色（選填）
            </label>
            <input
              v-model="form.color"
              type="text"
              placeholder="例如：白色"
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
              {{ submitting ? "處理中..." : editingId ? "儲存變更" : "新增車輛" }}
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
            class="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {{ error }}
          </div>
        </form>
      </section>
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
              廠牌 / 車系
            </th>
            <th class="py-2 pr-4">
              年份
            </th>
            <th class="py-2 pr-4">
              顏色
            </th>
            <th class="py-2 pr-4">
              狀態
            </th>
            <th class="py-2 pr-4">
              建立時間
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="vehicles.length === 0">
            <td
              colspan="5"
              class="py-3 text-sm text-app-text-muted"
            >
              尚無資料，先點右上角「新增車輛」。
            </td>
          </tr>
          <tr
            v-for="v in vehicles"
            :key="v.id"
            class="border-t border-app-border hover:bg-app-muted transition"
          >
            <td class="py-2 pr-4 font-medium text-app-text-primary">
              {{ v.make }} {{ v.model }}
            </td>
            <td class="py-2 pr-4">
              {{ v.year ?? "—" }}
            </td>
            <td class="py-2 pr-4">
              {{ v.color ?? "—" }}
            </td>
            <td class="py-2 pr-4">
              <span class="inline-flex rounded-full bg-app-muted px-2 py-0.5 text-xs text-app-text-primary">
                {{ v.status }}
              </span>
            </td>
            <td class="py-2 pr-4 text-xs text-app-text-muted">
              {{ new Date(v.created_at).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Vehicle } from "@core";
import { vehicleManager } from "@core";

const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = reactive<{
  make: string;
  model: string;
  year: number | null;
  color: string;
}>({
  make: "",
  model: "",
  year: null,
  color: ""
});

function resetForm() {
  form.make = "";
  form.model = "";
  form.year = null;
  form.color = "";
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
    vehicles.value = await vehicleManager.list();
  } catch (e: any) {
    error.value = e?.message ?? "載入失敗";
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (!form.make.trim() || !form.model.trim()) return;
  submitting.value = true;
  error.value = null;
  try {
    if (editingId.value) {
      const updated = await vehicleManager.update(editingId.value, {
        make: form.make.trim(),
        model: form.model.trim(),
        year: form.year ?? null,
        color: form.color.trim() || null
      });
      vehicles.value = vehicles.value.map((v) =>
        v.id === updated.id ? updated : v
      );
    } else {
      const created = await vehicleManager.create({
        make: form.make.trim(),
        model: form.model.trim(),
        year: form.year ?? null,
        color: form.color.trim() || null
      });
      vehicles.value = [created, ...vehicles.value];
    }
    closeForm();
  } catch (e: any) {
    error.value = e?.message ?? "儲存失敗";
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

