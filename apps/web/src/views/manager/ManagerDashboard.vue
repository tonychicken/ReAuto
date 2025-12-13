<template>
  <div class="mx-auto max-w-6xl px-4 py-6 space-y-4">
    <section>
      <h2 class="text-xl font-semibold text-app-text-primary">
        Manager 管理總覽
      </h2>
      <p class="mt-1 text-sm text-app-text-secondary">
        這裡是「設定型」資料的管理入口：倉庫、維修廠、車輛。每個模組都有自己的 Manager / Service，
        之後 Web / Desktop / Mobile 都會共用這些邏輯。
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <RouterLink
        to="/manager/warehouses"
        class="block rounded-xl border border-app-border bg-app-surface p-4 shadow-sm transition hover:border-primary-500 hover:shadow"
      >
        <h3 class="text-sm font-semibold text-app-text-primary">
          倉庫管理
        </h3>
        <p class="mt-1 text-xs text-app-text-secondary">
          新增 / 編輯車輛所在倉庫（主倉、寄庫場、展示中心）。
        </p>
      </RouterLink>

      <RouterLink
        to="/manager/partners"
        class="block rounded-xl border border-app-border bg-app-surface p-4 shadow-sm transition hover:border-primary-500 hover:shadow"
      >
        <h3 class="text-sm font-semibold text-app-text-primary">
          維修 / 服務廠管理
        </h3>
        <p class="mt-1 text-xs text-app-text-secondary">
          管理合作維修廠、美容廠、驗車廠，之後可用於比價與報價紀錄。
        </p>
      </RouterLink>

      <RouterLink
        to="/manager/vehicles"
        class="block rounded-xl border border-app-border bg-app-surface p-4 shadow-sm transition hover:border-primary-500 hover:shadow"
      >
        <h3 class="text-sm font-semibold text-app-text-primary">
          車輛主檔管理
        </h3>
        <p class="mt-1 text-xs text-app-text-secondary">
          管理車輛基本資料（廠牌、車系、年份、顏色），後續會接上收購 / 庫存 / 上架流程。
        </p>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>


