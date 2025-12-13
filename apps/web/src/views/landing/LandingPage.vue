<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- 頂部導覽列 -->
    <header class="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-20 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
              ReAuto
            </div>
            <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              車商庫存管理平台
            </span>
          </div>

          <!-- 導覽選單 -->
          <nav class="hidden md:flex items-center gap-6">
            <a
              href="#features"
              class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              @click.prevent="scrollToSection('features')"
            >
              產品介紹
            </a>
            <a
              href="#news"
              class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              @click.prevent="scrollToSection('news')"
            >
              最新消息
            </a>
            <a
              href="#contact"
              class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              @click.prevent="scrollToSection('contact')"
            >
              聯絡我們
            </a>
          </nav>

          <!-- 行動按鈕 -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="hidden sm:inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              @click="openRegisterDialog('individual')"
            >
              個人註冊
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="openRegisterDialog('enterprise')"
            >
              免費立即體驗
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero 區塊 -->
    <section class="relative overflow-hidden pt-20 pb-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl md:text-7xl">
            <span class="block">二手車商</span>
            <span class="block text-blue-600 dark:text-blue-400">庫存管理新革命</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            整合倉庫、車輛、維修、收購、銷售一體化管理，讓每一台車都有完整的生命週期追蹤
          </p>
          <div class="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              class="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="openRegisterDialog('enterprise')"
            >
              立即免費試用
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-8 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              @click="scrollToSection('features')"
            >
              了解更多
            </button>
          </div>
        </div>

        <!-- 示意圖 -->
        <div class="mt-16 flex items-center justify-center">
          <div class="relative w-full max-w-4xl">
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-2xl">
              <div class="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                <div class="text-center">
                  <div class="mx-auto h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                    <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p class="text-slate-600 dark:text-slate-400 text-sm">系統示意圖</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 產品特點 -->
    <section id="features" class="py-24 bg-white dark:bg-slate-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            為什麼選擇 ReAuto？
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            專為二手車商打造的智能庫存管理系統
          </p>
        </div>

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 特點 1 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              🚗 車輛全生命週期追蹤
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              從收購、整備、上架到售出，每一台車的狀態、成本、利潤都清晰可見，再也不會找不到車、算不清帳
            </p>
          </div>

          <!-- 特點 2 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              💰 成本利潤即時計算
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              收購價、維修費、美容費自動累加，售出後成本鎖定，毛利淨利一目了然，決策更精準
            </p>
          </div>

          <!-- 特點 3 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              🏢 多租戶組織管理
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              支援多據點、多部門、自訂角色權限，總公司統一管理，各據點獨立運作，資料完全隔離
            </p>
          </div>

          <!-- 特點 4 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              📋 智能狀態標籤系統
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              自動偵測車輛整備狀態，未美容、缺證明、需維修一目了然，避免遺漏重要步驟
            </p>
          </div>

          <!-- 特點 5 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              📸 文件圖片管理
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              美容前後對比、認證證書、完稅證明、過戶文件一鍵上傳，所有資料雲端保存，隨時查閱
            </p>
          </div>

          <!-- 特點 6 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              ⚡ 即時同步多平台
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              庫存狀態即時更新，支援未來擴充電商平台同步，一鍵上架多平台，節省重複作業時間
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新消息 -->
    <section id="news" class="py-24 bg-slate-50 dark:bg-slate-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            最新消息
          </h2>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(news, index) in newsList"
            :key="index"
            class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition"
          >
            <div class="text-sm text-slate-500 dark:text-slate-400 mb-2">
              {{ news.date }}
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {{ news.title }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              {{ news.content }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 聯絡我們 -->
    <section id="contact" class="py-24 bg-white dark:bg-slate-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            聯絡我們
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            有任何問題或建議，歡迎與我們聯繫
          </p>
        </div>

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              電子郵件
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              support@reauto.com
            </p>
          </div>

          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              客服專線
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              0800-123-456
            </p>
          </div>

          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              線上客服
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              週一至週五 9:00-18:00
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 註冊 Dialog -->
    <RegisterDialog
      v-model:open="registerDialogOpen"
      :register-type="registerType"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RegisterDialog from "@/components/landing/RegisterDialog.vue";

const registerDialogOpen = ref(false);
const registerType = ref<"enterprise" | "individual">("enterprise");

const newsList = [
  {
    date: "2024-01-15",
    title: "ReAuto 正式上線！",
    content: "專為二手車商打造的智能庫存管理系統正式開放試用，歡迎車商朋友們體驗。"
  },
  {
    date: "2024-01-10",
    title: "新增 Google 登入功能",
    content: "現在可以使用 Google 帳號快速登入系統，註冊流程更簡單。"
  },
  {
    date: "2024-01-05",
    title: "試用期間免費使用",
    content: "試用期間所有功能完全免費，無需綁定信用卡，隨時可取消。"
  }
];

function openRegisterDialog(type: "enterprise" | "individual") {
  registerType.value = type;
  registerDialogOpen.value = true;
}

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function handleRegisterSuccess() {
  registerDialogOpen.value = false;
}
</script>

