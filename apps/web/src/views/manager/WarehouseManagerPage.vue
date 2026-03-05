<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-app-text-primary">
          倉庫管理
        </h2>
        <p class="mt-1 text-sm text-app-text-secondary">
          管理所有倉庫資訊，包含主倉、合作倉與展示中心
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
        新增倉庫
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
              {{ editingId ? "編輯倉庫" : "新增倉庫" }}
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
                倉庫名稱 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="例如：台北主倉"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                類型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                required
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              >
                <option value="internal">
                  主倉（自有）
                </option>
                <option value="partner">
                  合作倉（寄庫）
                </option>
                <option value="showroom">
                  展示中心
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
                placeholder="聯絡電話"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="md:col-span-2 space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                地址
              </label>
              <input
                v-model="form.address"
                type="text"
                placeholder="完整地址"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="md:col-span-2 flex items-center gap-3">
              <input
                id="is_active"
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-app-border text-primary-600 focus:ring-primary-500"
              />
              <label
                for="is_active"
                class="text-sm font-medium text-app-text-primary"
              >
                啟用此倉庫
              </label>
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
                {{ submitting ? "處理中..." : editingId ? "儲存變更" : "新增倉庫" }}
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
        </div>
      </div>
    </Transition>

    <!-- List Section -->
    <section class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
      <!-- Filters -->
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in typeFilters"
            :key="t.value"
            type="button"
            class="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition"
            :class="
              activeType === t.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-app-border bg-app-surface text-app-text-secondary hover:border-primary-300 hover:bg-app-muted'
            "
            @click="activeType = t.value"
          >
            {{ t.label }}
          </button>
        </div>
        <label class="inline-flex items-center gap-2 text-sm text-app-text-primary">
          <input
            v-model="showInactive"
            type="checkbox"
            class="h-4 w-4 rounded border-app-border text-primary-600 focus:ring-primary-500"
          />
          顯示已停用
        </label>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex items-center justify-center py-12"
      >
        <svg
          class="h-8 w-8 animate-spin text-primary-600"
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
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredWarehouses.length === 0"
        class="py-12 text-center"
      >
        <svg
          class="mx-auto h-12 w-12 text-app-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="mt-3 text-sm font-medium text-app-text-primary">
          尚無倉庫資料
        </p>
        <p class="mt-1 text-sm text-app-text-muted">
          點擊上方「新增倉庫」開始建立
        </p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-app-muted">
            <tr>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                倉庫名稱
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                類型
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                聯絡資訊
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                地址
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                狀態
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-text-primary"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-app-border bg-app-surface">
            <tr
              v-for="w in filteredWarehouses"
              :key="w.id"
              class="hover:bg-slate-50 transition"
            >
              <td class="whitespace-nowrap px-4 py-4">
                <div class="text-sm font-medium text-app-text-primary">
                  {{ w.name }}
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="typeBadgeClass(w.type)"
                >
                  {{ typeLabel(w.type) }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-app-text-primary">
                  {{ w.contact_name || "—" }}
                </div>
                <div
                  v-if="w.contact_phone"
                  class="text-xs text-app-text-muted"
                >
                  {{ w.contact_phone }}
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="max-w-xs text-sm text-app-text-secondary">
                  {{ w.address || "—" }}
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-4">
                <button
                  type="button"
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition"
                  :class="
                    w.is_active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-app-muted text-app-text-secondary hover:bg-app-border'
                  "
                  @click="handleToggleActive(w)"
                >
                  {{ w.is_active ? "啟用" : "停用" }}
                </button>
              </td>
              <td class="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 transition"
                    title="編輯"
                    @click="editWarehouse(w)"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                    title="刪除"
                    @click="confirmDelete(w)"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deletingWarehouse"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="deletingWarehouse = null"
      >
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-900">
            確認刪除
          </h3>
          <p class="mt-2 text-sm text-slate-600">
            確定要刪除「<span class="font-medium text-slate-900">{{ deletingWarehouse.name }}</span>」嗎？此操作無法復原。
          </p>
          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              @click="deletingWarehouse = null"
            >
              取消
            </button>
            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              :disabled="submitting"
              @click="handleDelete"
            >
              {{ submitting ? "刪除中..." : "確認刪除" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { Warehouse } from "@core";
import { warehouseManager } from "@core";

const warehouses = ref<Warehouse[]>([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const editingId = ref<string | null>(null);
const deletingWarehouse = ref<Warehouse | null>(null);

const form = reactive({
  name: "",
  type: "internal" as "internal" | "partner" | "showroom",
  address: "",
  contact_name: "",
  contact_phone: "",
  is_active: true
});

const typeFilters = [
  { value: "all", label: "全部類型" },
  { value: "internal", label: "主倉" },
  { value: "partner", label: "合作倉" },
  { value: "showroom", label: "展示中心" }
] as const;

const activeType = ref<"all" | "internal" | "partner" | "showroom">("all");
const showInactive = ref(false);

const filteredWarehouses = computed(() => {
  return warehouses.value.filter((w) => {
    if (!showInactive.value && !w.is_active) return false;
    if (activeType.value !== "all" && w.type !== activeType.value) return false;
    return true;
  });
});

function typeLabel(type: string | null): string {
  if (type === "partner") return "合作倉";
  if (type === "showroom") return "展示中心";
  return "主倉";
}

function typeBadgeClass(type: string | null): string {
  if (type === "partner") return "bg-blue-100 text-blue-800";
  if (type === "showroom") return "bg-purple-100 text-purple-800";
  return "bg-slate-100 text-slate-800";
}

function resetForm() {
  form.name = "";
  form.type = "internal";
  form.address = "";
  form.contact_name = "";
  form.contact_phone = "";
  form.is_active = true;
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

function editWarehouse(w: Warehouse) {
  editingId.value = w.id;
  form.name = w.name;
  form.type = (w.type || "internal") as "internal" | "partner" | "showroom";
  form.address = w.address || "";
  form.contact_name = w.contact_name || "";
  form.contact_phone = w.contact_phone || "";
  form.is_active = w.is_active;
  showForm.value = true;
  // Scroll to form
  setTimeout(() => {
    document.querySelector("section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    warehouses.value = await warehouseManager.list();
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
      const updated = await warehouseManager.update(editingId.value, {
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim() || null,
        contact_name: form.contact_name.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        is_active: form.is_active
      });
      const idx = warehouses.value.findIndex((x) => x.id === editingId.value);
      if (idx >= 0) {
        warehouses.value.splice(idx, 1, updated);
      }
    } else {
      const created = await warehouseManager.create({
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim() || null,
        contact_name: form.contact_name.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        is_active: form.is_active
      });
      warehouses.value = [created, ...warehouses.value];
    }
    closeForm();
  } catch (e: any) {
    error.value = e?.message ?? (editingId.value ? "更新失敗" : "新增失敗");
  } finally {
    submitting.value = false;
  }
}

function confirmDelete(w: Warehouse) {
  deletingWarehouse.value = w;
}

async function handleDelete() {
  if (!deletingWarehouse.value) return;
  submitting.value = true;
  error.value = null;
  try {
    await warehouseManager.delete(deletingWarehouse.value.id);
    warehouses.value = warehouses.value.filter((w) => w.id !== deletingWarehouse.value!.id);
    deletingWarehouse.value = null;
  } catch (e: any) {
    error.value = e?.message ?? "刪除失敗";
  } finally {
    submitting.value = false;
  }
}

async function handleToggleActive(w: Warehouse) {
  const next = !w.is_active;
  try {
    const updated = await warehouseManager.setActive(w.id, next);
    const idx = warehouses.value.findIndex((x) => x.id === w.id);
    if (idx >= 0) {
      warehouses.value.splice(idx, 1, updated);
    }
  } catch (e: any) {
    error.value = e?.message ?? "狀態更新失敗";
  }
}

onMounted(load);
</script>
