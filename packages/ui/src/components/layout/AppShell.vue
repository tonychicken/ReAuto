<template>
  <div class="min-h-screen flex bg-app-sidebar text-app-text-primary">
    <!-- Sidebar -->
    <!-- Sidebar：改用 translate-x 做整塊滑入 / 滑出 -->
    <aside
      v-if="$slots.sidebar"
      :class="[
        'relative z-20 flex h-screen flex-col border-r border-app-sidebarBorder bg-app-sidebar overflow-hidden transform transition-all duration-300 ease-out',
        collapsed ? '-translate-x-full w-0' : 'translate-x-0 w-48'
      ]"
    >
      <div class="flex h-full flex-col">
        <!-- Sidebar header / logo -->
        <div class="flex h-14 shrink-0 items-center justify-center px-3 border-b border-app-sidebarBorder">
          <slot name="logo">
            <p
              v-if="!collapsed"
              class="w-full truncate text-[11px] font-semibold tracking-wide text-app-text-primary text-center bg-app-surface rounded-md px-2 py-1"
            >
              車商庫存管理平台
            </p>
          </slot>
        </div>

        <!-- Sidebar nav - 獨立滾動 -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3 pt-1">
          <slot
            name="sidebar"
            :collapsed="collapsed"
          />
        </div>

        <!-- Sidebar footer / user info - 固定在底部 -->
        <div
          v-if="user"
          class="shrink-0 border-t border-app-sidebarBorder px-3 py-3 text-xs text-app-text-secondary bg-app-sidebar"
        >
          <button
            type="button"
            class="w-full flex items-center gap-2 rounded-md px-2 py-2 hover:bg-app-muted transition-colors cursor-pointer"
            @click="$emit('user-info-click')"
          >
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-app-muted text-[10px] font-semibold text-app-text-primary shrink-0">
              {{ (user.display_name || user.email || "U").slice(0, 1).toUpperCase() }}
            </div>
            <div
              v-if="!collapsed"
              class="min-w-0 flex-1 text-left"
            >
              <p class="truncate text-xs font-medium text-app-text-primary">
                {{ user.display_name || user.email }}
              </p>
              <p
                v-if="tenant"
                class="truncate text-[10px] text-app-text-muted"
              >
                {{ tenant.name }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="relative flex h-screen flex-1 flex-col bg-app-bg overflow-hidden">
      <!-- 內容上方的麵包屑 / 導覽列 - 固定在頂部 -->
      <header
        v-if="$slots.topbar"
        class="flex h-14 shrink-0 items-center gap-3 border-b border-app-border bg-app-surface/95 px-4 text-xs text-app-text-secondary"
      >
        <!-- 折疊按鈕放在 header 內，靠左 -->
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md border border-app-border bg-app-surface text-[11px] text-app-text-primary shadow-sm hover:bg-app-muted transition-colors"
          @click="toggleCollapsed"
        >
            ☰
        </button>

        <div class="flex-1 overflow-hidden">
          <slot name="topbar" />
        </div>
      </header>

      <!-- Main content - 獨立滾動 -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { User, Tenant } from "@core";

interface Props {
  user?: User | null;
  tenant?: Tenant | null;
  onLogout?: () => void;
}

interface Emits {
  (e: "user-info-click"): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  tenant: null,
  onLogout: undefined
});

const emit = defineEmits<Emits>();

const collapsed = ref(false);

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

const user = props.user;
const tenant = props.tenant;
const onLogout = props.onLogout;
</script>


