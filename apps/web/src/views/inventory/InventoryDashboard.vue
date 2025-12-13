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
      <router-link
        to="/inventory/acquisition"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
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
      </router-link>
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
            @click="goToDetail(item.vehicle_id)"
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
                  v-if="item.vehicle.status === 'draft'"
                  type="button"
                  class="rounded px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  @click.stop="goToDetail(item.vehicle_id)"
                >
                  續寫
                </button>
                <button
                  type="button"
                  class="rounded px-2 py-1 text-xs text-app-text-secondary hover:bg-app-muted"
                  @click.stop="goToDetail(item.vehicle_id)"
                >
                  詳情
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { InventoryItem } from "@core";
import { inventoryManager, warehouseManager, vehicleDetailsManager } from "@core";
import type { Warehouse } from "@core";
import { usePermissions } from "@/composables/usePermissions";
import { useVehicleStatusTags } from "@/composables/useVehicleStatusTags";
import type { VehicleDetails } from "@core";

const router = useRouter();
const { canRead } = usePermissions();

const items = ref<InventoryItem[]>([]);
const warehouses = ref<Warehouse[]>([]);
const vehicleDetailsMap = ref<Record<string, VehicleDetails>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const activeFilter = ref<string>("available");

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

function goToDetail(vehicleId: string) {
  router.push(`/vehicles/${vehicleId}`);
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
