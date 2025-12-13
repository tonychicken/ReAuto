<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
        @click.self="emit('update:open', false)"
      >
        <div class="flex h-[520px] w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700">
          <!-- 左側分類 -->
          <aside class="w-44 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-4">
            <button
              v-for="section in sections"
              :key="section.id"
              type="button"
              class="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              :class="{ 'bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-slate-100': section.id === activeId }"
              @click="activeId = section.id"
            >
              {{ section.label }}
            </button>
          </aside>

          <!-- 右側內容 -->
          <section class="flex-1 space-y-4 overflow-y-auto p-6">
            <header class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {{ activeSection?.label }}
              </h2>
              <button
                type="button"
                class="rounded-full p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
                @click="emit('update:open', false)"
              >
                ✕
              </button>
            </header>

            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ activeSection?.description }}
            </p>

            <div class="space-y-3 text-sm">
              <slot name="section" :section="activeSection" />
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

interface SettingsDialogSection {
  id: string;
  label: string;
  description?: string;
}

const props = defineProps<{
  open: boolean;
  sections: readonly SettingsDialogSection[];
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const activeId = ref<string | null>(null);

watchEffect(() => {
  if (props.open && !activeId.value && props.sections.length > 0) {
    activeId.value = props.sections[0].id;
  }
});

const activeSection = computed<SettingsDialogSection | null>(() => {
  return props.sections.find((s) => s.id === activeId.value) ?? null;
});
</script>