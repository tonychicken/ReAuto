<template>
  <div class="mx-auto max-w-3xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header>
      <h2 class="text-2xl font-bold text-app-text-primary">
        車輛收購 / 入庫
      </h2>
      <p class="mt-1 text-sm text-app-text-secondary">
        快速建立新車入庫紀錄，即使資訊不完整也能先記起來
      </p>
    </header>

    <!-- Form -->
    <section class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
      <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- 車輛基本資訊 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-app-text-primary">
            車輛基本資訊
          </h3>
          <div class="grid gap-4 md:grid-cols-2">
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
                年份 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.year"
                type="number"
                required
                min="1970"
                max="2100"
                placeholder="例如：2020"
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

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                VIN / 車身號（選填）
              </label>
              <input
                v-model="form.vin"
                type="text"
                placeholder="例如：JT1234567890"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                車牌（選填）
              </label>
              <input
                v-model="form.plate_number"
                type="text"
                placeholder="例如：ABC-1234"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                里程數（選填）
              </label>
              <input
                v-model.number="form.mileage_km"
                type="number"
                min="0"
                placeholder="例如：50000"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>
          </div>
        </div>

        <!-- 收購資訊 -->
        <div class="space-y-4 border-t border-app-border pt-4">
          <h3 class="text-lg font-semibold text-app-text-primary">
            收購資訊
          </h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                收購價格 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.purchase_price"
                type="number"
                required
                min="0"
                step="1000"
                placeholder="例如：800000"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                收購日期 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.purchase_date"
                type="date"
                required
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="block text-sm font-medium text-app-text-primary">
                所在倉庫 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.warehouse_id"
                required
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              >
                <option value="">
                  請選擇倉庫
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
          </div>
        </div>

        <!-- 賣家資訊（選填） -->
        <div class="space-y-4 border-t border-app-border pt-4">
          <h3 class="text-lg font-semibold text-app-text-primary">
            賣家資訊（選填）
          </h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                賣家姓名
              </label>
              <input
                v-model="form.seller_name"
                type="text"
                placeholder="例如：王小明"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-app-text-primary">
                賣家電話
              </label>
              <input
                v-model="form.seller_phone"
                type="tel"
                placeholder="例如：0912345678"
                class="w-full rounded-lg border border-app-border bg-app-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-app-text-primary"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 border-t border-app-border pt-4">
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
            {{ submitting ? "處理中..." : "完成入庫" }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-app-border px-5 py-2.5 text-sm font-medium text-app-text-primary transition hover:bg-app-muted"
            @click="handleSaveDraft"
          >
            儲存草稿
          </button>
          <button
            type="button"
            class="rounded-lg px-5 py-2.5 text-sm font-medium text-app-text-secondary transition hover:text-app-text-primary"
            @click="$router.back()"
          >
            取消
          </button>
        </div>

        <div
          v-if="error"
          class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400"
        >
          {{ error }}
        </div>
      </form>
    </section>

    <!-- Success Dialog -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccess"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click="showSuccess = false"
      >
        <div
          class="w-full max-w-md rounded-xl border border-app-border bg-app-surface p-6 shadow-lg"
          @click.stop
        >
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                class="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-app-text-primary">
                入庫成功！
              </h3>
              <p class="text-sm text-app-text-secondary">
                車輛已成功建立並入庫
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
              @click="goToDetail"
            >
              前往車輛詳情
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-text-primary transition hover:bg-app-muted"
              @click="goToList"
            >
              回庫存清單
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { vehicleManager, vehicleInventoryManager, acquisitionManager, contactManager, warehouseManager } from "@core";
import type { Warehouse } from "@core";

const router = useRouter();

const warehouses = ref<Warehouse[]>([]);
const submitting = ref(false);
const error = ref<string | null>(null);
const showSuccess = ref(false);
const createdVehicleId = ref<string | null>(null);

const form = reactive({
  // 車輛基本資訊
  make: "",
  model: "",
  year: null as number | null,
  color: "",
  vin: "",
  plate_number: "",
  mileage_km: null as number | null,
  // 收購資訊
  purchase_price: null as number | null,
  purchase_date: new Date().toISOString().split("T")[0],
  warehouse_id: "",
  // 賣家資訊
  seller_name: "",
  seller_phone: ""
});

async function loadWarehouses() {
  try {
    warehouses.value = await warehouseManager.list();
  } catch (e: any) {
    console.error("載入倉庫失敗", e);
  }
}

async function handleSubmit() {
  if (!form.make.trim() || !form.model.trim() || !form.year || !form.purchase_price || !form.warehouse_id) {
    error.value = "請填寫所有必填欄位";
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    // 1. 建立車輛
    const vehicle = await vehicleManager.create({
      make: form.make.trim(),
      model: form.model.trim(),
      year: form.year,
      color: form.color.trim() || null,
      vin: form.vin.trim() || null,
      plate_number: form.plate_number.trim() || null,
      mileage_km: form.mileage_km ?? null,
      status: "in_preparation"
    });

    // 2. 建立庫存紀錄
    await vehicleInventoryManager.create({
      vehicle_id: vehicle.id,
      warehouse_id: form.warehouse_id,
      status: "in_stock",
      stock_date: form.purchase_date
    });

    // 3. 建立賣家聯絡人（如果有填寫）
    let sellerContactId: string | null = null;
    if (form.seller_name.trim() || form.seller_phone.trim()) {
      const contact = await contactManager.create({
        type: "seller",
        name: form.seller_name.trim() || "未命名",
        phone: form.seller_phone.trim() || null
      });
      sellerContactId = contact.id;
    }

    // 4. 建立收購紀錄
    await acquisitionManager.create({
      vehicle_id: vehicle.id,
      seller_contact_id: sellerContactId,
      purchase_price: form.purchase_price,
      purchase_date: form.purchase_date
    });

    createdVehicleId.value = vehicle.id;
    showSuccess.value = true;
  } catch (e: any) {
    console.error("入庫失敗", e);
    error.value = e?.message ?? "入庫失敗，請稍後再試";
  } finally {
    submitting.value = false;
  }
}

async function handleSaveDraft() {
  if (!form.make.trim() || !form.model.trim()) {
    error.value = "請至少填寫廠牌和車系";
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    // 建立草稿車輛（status=draft）
    const vehicle = await vehicleManager.create({
      make: form.make.trim(),
      model: form.model.trim(),
      year: form.year ?? null,
      color: form.color.trim() || null,
      vin: form.vin.trim() || null,
      plate_number: form.plate_number.trim() || null,
      mileage_km: form.mileage_km ?? null,
      status: "draft"
    });

    // 如果有選擇倉庫，也建立庫存紀錄
    if (form.warehouse_id) {
      await vehicleInventoryManager.create({
        vehicle_id: vehicle.id,
        warehouse_id: form.warehouse_id,
        status: "in_stock",
        stock_date: form.purchase_date || new Date().toISOString().split("T")[0]
      });
    }

    // 如果有填寫收購資訊，建立收購紀錄
    if (form.purchase_price) {
      let sellerContactId: string | null = null;
      if (form.seller_name.trim() || form.seller_phone.trim()) {
        const contact = await contactManager.create({
          type: "seller",
          name: form.seller_name.trim() || "未命名",
          phone: form.seller_phone.trim() || null
        });
        sellerContactId = contact.id;
      }

      await acquisitionManager.create({
        vehicle_id: vehicle.id,
        seller_contact_id: sellerContactId,
        purchase_price: form.purchase_price,
        purchase_date: form.purchase_date || new Date().toISOString().split("T")[0]
      });
    }

    router.push("/inventory");
  } catch (e: any) {
    console.error("儲存草稿失敗", e);
    error.value = e?.message ?? "儲存草稿失敗，請稍後再試";
  } finally {
    submitting.value = false;
  }
}

function goToDetail() {
  if (createdVehicleId.value) {
    router.push(`/vehicles/${createdVehicleId.value}`);
  } else {
    router.push("/inventory");
  }
}

function goToList() {
  router.push("/inventory");
}

onMounted(() => {
  loadWarehouses();
});
</script>

