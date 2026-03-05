<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
    <div class="text-center">
      <div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      <p class="text-sm text-slate-600 dark:text-slate-400">
        正在處理登入...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabaseClient } from "@core";
import { initAuth, getAuthContext } from "@core";

const router = useRouter();

onMounted(async () => {
  try {
    // 處理 OAuth callback
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    // 檢查是否有 profile，如果沒有則建立（新用戶）
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    const isNewUser = !profile;

    if (isNewUser) {
      // 建立 profile（從 Google 取得的資訊）
      await supabaseClient
        .from("profiles")
        .insert({
          id: session.user.id,
          display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || null,
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
        });
    }

    // 初始化認證狀態
    await initAuth();

    // 檢查是否有 tenant
    const authContext = getAuthContext();

    if (!authContext.tenant) {
      // 新用戶沒有租戶，導向到 Onboarding 流程
      router.push({
        name: "onboarding",
        query: {
          source: "google",
          email: session.user.email ?? undefined
        }
      });
    } else {
      // 已有租戶，直接導向到庫存系統
      router.push({ name: "manager-inventory" });
    }
  } catch (error) {
    console.error("OAuth callback 處理失敗", error);
    router.push("/login");
  }
});
</script>

