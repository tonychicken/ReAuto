<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-app-text-primary">
          庫存總覽
        </h2>
        <p class="mt-1 text-sm text-app-text-secondary">
          查看所有車輛庫存狀態，支援多條件篩選與快捷操作
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
        @click="showAcquisitionDialog = true"
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
        新增車輛（收購）
      </button>
    </header>

    <!-- 快捷篩選按鈕 -->
    <section class="flex flex-wrap gap-2">
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition"
        :class="activeFilter === filter.id
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          : 'border-app-border bg-app-surface text-app-text-primary hover:bg-app-muted'"
        @click="applyQuickFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
    </section>

    <!-- 進階篩選 -->
    <section class="rounded-xl border border-app-border bg-app-surface p-4 shadow-sm">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1.5">
          <label class="block text-xs font-medium text-app-text-secondary">
            倉庫
          </label>
          <select
            v-model="filters.warehouseId"
            class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            @change="() => loadInventory()"
          >
            <option value="">
              全部倉庫
            </option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.name }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-medium text-app-text-secondary">
            年份（起）
          </label>
          <input
            v-model.number="filters.yearFrom"
            type="number"
            min="1970"
            max="2100"
            placeholder="例如：2020"
            class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            @change="() => loadInventory()"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-medium text-app-text-secondary">
            年份（迄）
          </label>
          <input
            v-model.number="filters.yearTo"
            type="number"
            min="1970"
            max="2100"
            placeholder="例如：2023"
            class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
            @change="() => loadInventory()"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-medium text-app-text-secondary">
            價格區間（萬）
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="filters.priceFrom"
              type="number"
              min="0"
              placeholder="起"
              class="flex-1 min-w-0 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              @change="() => loadInventory()"
            >
            <span class="flex-shrink-0 text-sm text-app-text-muted">-</span>
            <input
              v-model.number="filters.priceTo"
              type="number"
              min="0"
              placeholder="迄"
              class="flex-1 min-w-0 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              @change="() => loadInventory()"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 庫存清單 -->
    <section class="rounded-xl border border-app-border bg-app-surface shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-sm text-app-text-muted">
        載入中…
      </div>
      <div
        v-else-if="error"
        class="p-4 text-sm text-red-700 dark:text-red-400"
      >
        {{ error }}
      </div>
      <div v-else-if="items.length === 0" class="p-8 text-center text-sm text-app-text-muted">
        目前沒有符合條件的車輛
      </div>
      <table
        v-else
        class="min-w-full text-left text-sm text-app-text-primary"
      >
        <thead class="border-b border-app-border bg-app-muted text-xs uppercase text-app-text-muted">
          <tr>
            <th class="px-4 py-3">
              車輛資訊
            </th>
            <th class="px-4 py-3">
              所在倉庫
            </th>
            <th class="px-4 py-3">
              狀態
            </th>
            <th
              v-if="canViewCost"
              class="px-4 py-3"
            >
              收購價
            </th>
            <th class="px-4 py-3">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-t border-app-border hover:bg-app-muted transition cursor-pointer"
            @click="openVehicleDialog(item)"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  v-if="item.vehicle.cover_image_url"
                  class="h-12 w-16 flex-shrink-0 rounded overflow-hidden bg-app-muted"
                >
                  <img
                    :src="item.vehicle.cover_image_url"
                    :alt="`${item.vehicle.make} ${item.vehicle.model}`"
                    class="h-full w-full object-cover"
                  >
                </div>
                <div
                  v-else
                  class="h-12 w-16 flex-shrink-0 rounded bg-app-muted flex items-center justify-center text-xs text-app-text-muted"
                >
                  無圖
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-app-text-primary">
                    {{ item.vehicle.make }} {{ item.vehicle.model }}
                  </div>
                  <div class="text-xs text-app-text-secondary">
                    {{ item.vehicle.year ? `${item.vehicle.year}年` : "" }}
                    {{ item.vehicle.color || "" }}
                    {{ item.vehicle.plate_number ? `・${item.vehicle.plate_number}` : "" }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm text-app-text-primary">
                {{ item.warehouse.name }}
              </div>
              <div
                v-if="item.location_code"
                class="text-xs text-app-text-muted"
              >
                {{ item.location_code }}
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="getStatusBadgeClass(item.vehicle.status)"
                >
                  {{ getStatusLabel(item.vehicle.status) }}
                </span>
                <div
                  v-if="itemTags[item.vehicle_id] && itemTags[item.vehicle_id].length > 0"
                  class="flex items-center gap-1"
                >
                  <span
                    v-for="tag in itemTags[item.vehicle_id].slice(0, 2)"
                    :key="tag.id"
                    class="text-xs"
                    :title="tag.label"
                  >
                    {{ tag.icon }}
                  </span>
                  <span
                    v-if="itemTags[item.vehicle_id].length > 2"
                    class="text-xs text-app-text-muted"
                  >
                    +{{ itemTags[item.vehicle_id].length - 2 }}
                  </span>
                </div>
              </div>
            </td>
            <td
              v-if="canViewCost"
              class="px-4 py-3"
            >
              <div
                v-if="item.acquisition"
                class="text-sm font-medium text-app-text-primary"
              >
                ${{ formatPrice(item.acquisition.purchase_price) }}
              </div>
              <div
                v-else
                class="text-xs text-app-text-muted"
              >
                —
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  v-if="canEditInventory(item.vehicle.status)"
                  type="button"
                  class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                  title="刪除庫存記錄"
                  @click.stop="confirmDeleteInventory(item)"
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
    </section>

    <!-- 收購 / 入庫 Dialog（新增與編輯共用） -->
    <div
      v-if="showAcquisitionDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div class="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xl">
        <div class="flex items-center justify-between border-b border-app-border bg-app-bg px-4 py-3">
          <h2 class="text-sm font-semibold text-app-text-primary">
            {{ acquisitionMode === 'create' ? "新增車輛（收購 / 入庫）" : "編輯車輛 / 入庫資訊" }}
          </h2>
          <button
            type="button"
            class="rounded-md p-1 text-app-text-muted hover:bg-app-muted"
            @click="closeAcquisitionDialog"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <AcquisitionPage
            :mode="acquisitionMode"
            embedded
            :vehicle-id="selectedInventoryItem?.vehicle_id || null"
            :inventory-id="selectedInventoryItem?.id || null"
            @completed="handleAcquisitionCompleted"
            @cancel="closeAcquisitionDialog"
          />
        </div>
      </div>
    </div>

    <!-- 刪除庫存確認 Dialog -->
    <div
      v-if="deletingInventory"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="deletingInventory = null"
    >
      <div class="w-full max-w-md rounded-xl bg-app-surface p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-app-text-primary">
          確認刪除庫存記錄
        </h3>
        <p class="mt-2 text-sm text-app-text-secondary">
          確定要將
          <span class="font-medium">
            {{ deletingInventory.vehicle.make }} {{ deletingInventory.vehicle.model }}
          </span>
          從目前倉庫庫存中移除嗎？此操作不會刪除車輛主檔。
        </p>
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-text-primary hover:bg-app-muted"
            @click="deletingInventory = null"
          >
            取消
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            :disabled="savingInventory"
            @click="handleDeleteInventory"
          >
            {{ savingInventory ? "刪除中..." : "確認刪除" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { InventoryItem } from "@core";
import {
  inventoryManager,
  warehouseManager,
  vehicleDetailsManager,
  vehicleInventoryManager,
  vehicleManager
} from "@core";
import type { Warehouse } from "@core";
import { usePermissions } from "@/composables/usePermissions";
import { useVehicleStatusTags } from "@/composables/useVehicleStatusTags";
import type { VehicleDetails } from "@core";
import AcquisitionPage from "@/views/inventory/AcquisitionPage.vue";

const router = useRouter();
const { canRead } = usePermissions();

const items = ref<InventoryItem[]>([]);
const warehouses = ref<Warehouse[]>([]);
const vehicleDetailsMap = ref<Record<string, VehicleDetails>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const activeFilter = ref<string>("available");
const showAcquisitionDialog = ref(false);
const acquisitionMode = ref<"create" | "edit">("create");
const selectedInventoryItem = ref<InventoryItem | null>(null);
const deletingInventory = ref<InventoryItem | null>(null);
const savingInventory = ref(false);

const filters = reactive({
  warehouseId: "",
  yearFrom: undefined as number | undefined,
  yearTo: undefined as number | undefined,
  priceFrom: undefined as number | undefined,
  priceTo: undefined as number | undefined
});

const quickFilters = [
  { id: "draft", label: "草稿/整備中", vehicleStatus: ["draft", "in_preparation"] },
  { id: "available", label: "可售", vehicleStatus: ["ready_for_sale", "listed", "reserved"] },
  { id: "sold", label: "已售/結案", vehicleStatus: ["sold", "closed"] }
];

function canEditInventory(status: string): boolean {
  const readOnlyStatuses = ["reserved", "sold", "closed", "scrapped"];
  return !readOnlyStatuses.includes(status);
}

const canViewCost = computed(() => {
  return canRead("acquisition");
});

const itemTags = computed(() => {
  const result: Record<string, ReturnType<typeof useVehicleStatusTags>["tags"]["value"]> = {};
  items.value.forEach((item) => {
    const details = vehicleDetailsMap.value[item.vehicle_id];
    if (details) {
      const { tags } = useVehicleStatusTags({
        has_detailing: details.has_detailing,
        has_certification: details.has_certification,
        has_tax_certificate: details.has_tax_certificate,
        has_origin_certificate: details.has_origin_certificate,
        has_transfer_done: details.has_transfer_done,
        keys_count: details.keys_count ?? undefined,
        expected_repair_cost: details.expected_repair_cost ?? undefined,
        repair_history: details.repair_history ?? undefined,
        status: item.vehicle.status
      });
      result[item.vehicle_id] = tags.value;
    }
  });
  return result;
});

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    draft: "草稿",
    in_preparation: "整備中",
    ready_for_sale: "待上架",
    listed: "上架中",
    reserved: "已預約",
    sold: "已售出",
    closed: "結案",
    scrapped: "報廢"
  };
  return statusMap[status] || status;
}

function getStatusBadgeClass(status: string): string {
  const classMap: Record<string, string> = {
    draft: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    in_preparation: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    ready_for_sale: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    listed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    reserved: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    sold: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    closed: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    scrapped: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
  };
  return classMap[status] || "bg-app-muted text-app-text-primary";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("zh-TW").format(price);
}

function applyQuickFilter(filterId: string) {
  activeFilter.value = filterId;
  const filter = quickFilters.find((f) => f.id === filterId);
  if (filter) {
    loadInventory(filter.vehicleStatus);
  }
}

async function loadInventory(vehicleStatus?: string | string[]) {
  loading.value = true;
  error.value = null;
  try {
    const filter: any = {
      vehicleStatus: vehicleStatus || quickFilters.find((f) => f.id === activeFilter.value)?.vehicleStatus || ["ready_for_sale", "listed", "reserved"]
    };

    if (filters.warehouseId) {
      filter.warehouseId = filters.warehouseId;
    }

    if (filters.yearFrom !== undefined && filters.yearFrom !== null) {
      filter.yearFrom = filters.yearFrom;
    }

    if (filters.yearTo !== undefined && filters.yearTo !== null) {
      filter.yearTo = filters.yearTo;
    }

    if (filters.priceFrom) {
      filter.priceFrom = filters.priceFrom * 10000; // 轉換為元
    }

    if (filters.priceTo) {
      filter.priceTo = filters.priceTo * 10000; // 轉換為元
    }

    items.value = await inventoryManager.listInventory(filter);

    // 載入車輛詳細資訊（用於計算狀態標籤）
    const vehicleIds = items.value.map((item) => item.vehicle_id);
    await Promise.all(
      vehicleIds.map(async (vehicleId) => {
        try {
          const details = await vehicleDetailsManager.getByVehicleId(vehicleId);
          if (details) {
            vehicleDetailsMap.value[vehicleId] = details;
          }
        } catch (e) {
          // 忽略錯誤（可能還沒有 vehicle_details）
        }
      })
    );
  } catch (e: any) {
    console.error("載入庫存失敗", e);
    error.value = e?.message ?? "載入失敗";
  } finally {
    loading.value = false;
  }
}

function openVehicleDialog(item: InventoryItem) {
  acquisitionMode.value = "edit";
  selectedInventoryItem.value = item;
  showAcquisitionDialog.value = true;
}

function confirmDeleteInventory(item: InventoryItem) {
  deletingInventory.value = item;
}

async function handleDeleteInventory() {
  if (!deletingInventory.value) return;

  savingInventory.value = true;
  try {
    await vehicleInventoryManager.delete(deletingInventory.value.id);
    deletingInventory.value = null;
    await loadInventory();
  } catch (e: any) {
    console.error("刪除庫存失敗", e);
    error.value = e?.message ?? "刪除庫存失敗";
  } finally {
    savingInventory.value = false;
  }
}

function closeAcquisitionDialog() {
  showAcquisitionDialog.value = false;
  selectedInventoryItem.value = null;
  acquisitionMode.value = "create";
}

async function handleAcquisitionCompleted() {
  showAcquisitionDialog.value = false;
  selectedInventoryItem.value = null;
  acquisitionMode.value = "create";
  await loadInventory();
}

async function loadWarehouses() {
  try {
    warehouses.value = await warehouseManager.list();
  } catch (e: any) {
    console.error("載入倉庫失敗", e);
  }
}

onMounted(() => {
  loadWarehouses();
  loadInventory();
});
</script>
