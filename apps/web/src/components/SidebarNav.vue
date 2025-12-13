<template>
  <nav class="flex flex-col gap-4 py-2 text-sm text-app-text-primary h-full">
    <!-- 有子項的 Section（樹狀層級，可展開/收合） -->
    <div class="flex-1 space-y-1">
    <div
        v-for="section in sectionsWithChildren"
      :key="section.id"
      class="space-y-1"
    >
      <!-- 展開狀態：大項按鈕 + 可收合子項 -->
      <button
        v-if="!collapsed"
        type="button"
          class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-app-text-primary hover:bg-app-muted transition-colors"
        @click="toggleSection(section.id)"
      >
        <span class="flex items-center gap-2">
          <span class="text-base leading-none">
            {{ section.icon }}
          </span>
          <span>{{ section.label }}</span>
        </span>
        <span
          class="text-[10px] transition-transform duration-150"
          :class="{ 'rotate-90': isOpen(section.id) }"
        >
          ▸
        </span>
      </button>

        <!-- 子項列表 -->
      <div
        v-if="!collapsed && isOpen(section.id)"
        class="space-y-0.5 pl-7"
      >
        <div
          v-for="item in section.items"
          :key="item.id"
        >
          <router-link
            v-if="item.to"
            :to="item.to"
              class="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-app-text-secondary hover:bg-app-muted hover:text-app-text-primary transition-colors"
              :class="{ 'bg-app-muted text-app-text-primary': isActive(item.to) }"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
                class="rounded-full bg-app-muted px-2 py-0.5 text-[10px] text-app-text-primary"
            >
              {{ item.badge }}
            </span>
          </router-link>

          <button
            v-else
            type="button"
              class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-app-text-secondary hover:bg-app-muted hover:text-app-text-primary transition-colors"
            @click="$emit('item-click', item)"
          >
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>

      <!-- 收合狀態：只顯示大項 icon rail，根據子項 active 高亮 + tooltip -->
      <button
          v-if="collapsed"
        type="button"
          class="flex w-full items-center justify-center rounded-md px-2 py-2 text-xs font-semibold text-app-text-secondary transition-colors"
        :class="{
            'bg-app-muted text-app-text-primary ring-1 ring-app-border':
            sectionHasActive(section)
        }"
        :title="section.label"
      >
        <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-md  text-[20px]"
        >
          {{ section.icon || section.label.slice(0, 1) }}
        </span>
      </button>
      </div>
    </div>

    <!-- 無子項的 Section（置底，無收合功能） -->
    <div class="mt-auto space-y-1 border-t border-app-sidebarBorder pt-2">
      <div
        v-for="section in sectionsWithoutChildren"
        :key="section.id"
      >
        <!-- 展開狀態：無子項按鈕 -->
        <button
          v-if="!collapsed"
          type="button"
          class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-app-text-primary hover:bg-app-muted transition-colors"
          @click="handleSectionClick(section)"
        >
          <span class="text-base leading-none">
            {{ section.icon }}
          </span>
          <span>{{ section.label }}</span>
        </button>

        <!-- 收合狀態：只顯示 icon -->
        <button
          v-if="collapsed"
          type="button"
          class="flex w-full items-center justify-center rounded-md px-2 py-2 text-xs font-semibold text-app-text-secondary hover:bg-app-muted transition-colors"
          :title="section.label"
        >
          <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-md  text-[28px]"
          >
            {{ section.icon || section.label.slice(0, 1) }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

interface SidebarNavItem {
  id: string;
  label: string;
  to?: string;
  badge?: string;
}

interface SidebarNavSection {
  id: string;
  label: string;
  icon?: string; // 收合狀態下顯示用的簡易 icon（預設用 label 首字）
  items: SidebarNavItem[];
}

const emit = defineEmits<{
  (e: "item-click", item: SidebarNavItem): void;
  (e: "section-click", section: SidebarNavSection): void;
}>();

const props = defineProps<{
  sections: readonly SidebarNavSection[];
  collapsed?: boolean;
}>();

const route = useRoute();

// 區分有子項和無子項的 sections
const sectionsWithChildren = computed(() => {
  return props.sections.filter((section) => section.items && section.items.length > 0);
});

const sectionsWithoutChildren = computed(() => {
  return props.sections.filter((section) => !section.items || section.items.length === 0);
});

// 只初始化有子項的 sections 為展開狀態
const openSectionIds = ref<Set<string>>(
  new Set(sectionsWithChildren.value.map((s) => s.id))
);

function isActive(to: string) {
  return route.path === to ;
}

function sectionHasActive(section: SidebarNavSection) {
  return section.items.some((item) => item.to && isActive(item.to));
}

function isOpen(id: string) {
  return openSectionIds.value.has(id);
}

function toggleSection(id: string) {
  const next = new Set(openSectionIds.value);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  openSectionIds.value = next;
}

function handleSectionClick(section: SidebarNavSection) {
  // 如果無子項的 section 有 items，觸發第一個 item 的點擊
  if (section.items && section.items.length > 0) {
    emit("item-click", section.items[0]);
  } else {
    // 否則觸發 section 本身的點擊事件
    emit("section-click", section);
  }
}
</script>