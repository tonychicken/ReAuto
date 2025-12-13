<template>
  <div class="mx-auto max-w-6xl px-4 py-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-app-text-primary">
          組織管理
        </h2>
        <p class="mt-1 text-sm text-app-text-secondary">
          管理組織資訊、成員與權限設定
        </p>
      </div>
      <button
        v-if="canCreateOrganization"
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
        @click="openCreateForm"
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
        建立新組織
      </button>
    </header>

    <!-- Current Organization Info -->
    <section
      v-if="currentTenant"
      class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm"
    >
      <h3 class="mb-4 text-lg font-semibold text-app-text-primary">
        當前組織
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="text-xs font-medium uppercase tracking-wide text-app-text-muted">
            組織名稱
          </label>
          <p class="mt-1 text-sm font-medium text-app-text-primary">
            {{ currentTenant.name }}
          </p>
        </div>
        <div>
          <label class="text-xs font-medium uppercase tracking-wide text-app-text-muted">
            方案類型
          </label>
          <p class="mt-1 text-sm font-medium text-app-text-primary">
            {{ planTypeLabel(currentTenant.plan_type) }}
          </p>
        </div>
        <div>
          <label class="text-xs font-medium uppercase tracking-wide text-app-text-muted">
            狀態
          </label>
          <p class="mt-1">
            <span
              class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="
                currentTenant.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ currentTenant.status === "active" ? "啟用" : "已暫停" }}
            </span>
          </p>
        </div>
        <div>
          <label class="text-xs font-medium uppercase tracking-wide text-app-text-muted">
            建立時間
          </label>
          <p class="mt-1 text-sm text-app-text-secondary">
            {{ formatDate(currentTenant.created_at) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Members Section -->
    <section class="rounded-xl border border-app-border bg-app-surface p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-app-text-primary">
          團隊成員
        </h3>
        <button
          v-if="canInviteMember"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-app-border px-3 py-1.5 text-sm font-medium text-app-text-primary transition hover:bg-app-muted"
          @click="openInviteForm"
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
          邀請成員
        </button>
      </div>

      <div
        v-if="loadingMembers"
        class="py-8 text-center text-sm text-app-text-muted"
      >
        載入中...
      </div>
      <div
        v-else-if="members.length === 0"
        class="py-8 text-center text-sm text-app-text-muted"
      >
        尚無成員
      </div>
      <table
        v-else
        class="min-w-full divide-y divide-slate-200"
      >
        <thead class="bg-app-muted">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
            >
              成員
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
            >
              角色
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
            >
              狀態
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-primary"
            >
              加入時間
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
            v-for="m in members"
            :key="m.id"
            class="hover:bg-app-muted transition"
          >
            <td class="whitespace-nowrap px-4 py-4">
              <div class="text-sm font-medium text-app-text-primary">
                {{ m.display_name || m.email || "—" }}
              </div>
              <div
                v-if="m.email"
                class="text-xs text-app-text-muted"
              >
                {{ m.email }}
              </div>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <span
                class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="roleBadgeClass(m.role)"
              >
                {{ roleLabel(m.role) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <span
                class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="statusBadgeClass(m.status)"
              >
                {{ statusLabel(m.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-sm text-app-text-secondary">
              {{ formatDate(m.created_at) }}
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  v-if="canManageMember"
                  type="button"
                  class="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 transition"
                  title="編輯角色"
                  @click="editMember(m)"
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
                  v-if="canRemoveMember && m.role !== 'owner'"
                  type="button"
                  class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                  title="移除成員"
                  @click="confirmRemoveMember(m)"
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

    <!-- Create Organization Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showCreateForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="showCreateForm = false"
      >
        <div class="w-full max-w-md rounded-xl bg-app-surface p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-app-text-primary">
            建立新組織
          </h3>
          <form
            class="mt-4 space-y-4"
            @submit.prevent="handleCreateOrganization"
          >
            <div>
              <label class="block text-sm font-medium text-app-text-primary">
                組織名稱
              </label>
              <input
                v-model="createForm.name"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-app-text-primary"
                placeholder="例如：XX 車業"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-app-text-primary">
                方案類型
              </label>
              <select
                v-model="createForm.plan_type"
                class="mt-1 w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-app-text-primary"
              >
                <option value="free">
                  免費版
                </option>
                <option value="standard">
                  標準版
                </option>
                <option value="pro">
                  專業版
                </option>
              </select>
            </div>
            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="showCreateForm = false"
              >
                取消
              </button>
              <button
                type="submit"
                class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
                :disabled="submitting"
              >
                {{ submitting ? "建立中..." : "建立" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Invite Member Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showInviteForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="showInviteForm = false"
      >
        <div class="w-full max-w-md rounded-xl bg-app-surface p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-app-text-primary">
            邀請成員
          </h3>
          <form
            class="mt-4 space-y-4"
            @submit.prevent="handleInviteMember"
          >
            <div>
              <label class="block text-sm font-medium text-app-text-primary">
                電子郵件
              </label>
              <input
                v-model="inviteForm.email"
                type="email"
                required
                class="mt-1 w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-app-text-primary"
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-app-text-primary">
                角色
              </label>
              <select
                v-model="inviteForm.role"
                class="mt-1 w-full rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-app-text-primary"
              >
                <option value="manager">
                  管理者
                </option>
                <option value="staff">
                  一般員工
                </option>
                <option value="viewer">
                  檢視者
                </option>
              </select>
            </div>
            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="showInviteForm = false"
              >
                取消
              </button>
              <button
                type="submit"
                class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
                :disabled="submitting"
              >
                {{ submitting ? "邀請中..." : "發送邀請" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Tenant, TenantMember, UserRole } from "@core";
import { tenantManager, tenantMemberManager } from "@core";
import { useAuth } from "@/composables/useAuth";
import { canWrite, canExecute, isOwner } from "@core";

const { tenant: currentTenant, refreshAuth } = useAuth();

const members = ref<(TenantMember & { display_name?: string; email?: string })[]>([]);
const loadingMembers = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);
const showCreateForm = ref(false);
const showInviteForm = ref(false);
const removingMember = ref<TenantMember | null>(null);

const createForm = ref({
  name: "",
  plan_type: "free" as "free" | "standard" | "pro"
});

const inviteForm = ref({
  email: "",
  role: "staff" as UserRole
});

// 權限檢查
const canCreateOrganization = computed(() => isOwner());
const canInviteMember = computed(() => canWrite("organization"));
const canManageMember = computed(() => canWrite("organization"));
const canRemoveMember = computed(() => canExecute("organization"));

async function loadMembers() {
  if (!currentTenant.value?.id) return;

  loadingMembers.value = true;
  try {
    const data = await tenantMemberManager.listByTenant(currentTenant.value.id);
    // TODO: 需要 join profiles 取得 display_name 和 email
    members.value = data as any;
  } catch (e: any) {
    error.value = e?.message ?? "載入成員失敗";
  } finally {
    loadingMembers.value = false;
  }
}

function openCreateForm() {
  showCreateForm.value = true;
  createForm.value = { name: "", plan_type: "free" };
}

function openInviteForm() {
  showInviteForm.value = true;
  inviteForm.value = { email: "", role: "staff" };
}

async function handleCreateOrganization() {
  submitting.value = true;
  error.value = null;
  try {
    const newTenant = await tenantManager.create({
      name: createForm.value.name,
      plan_type: createForm.value.plan_type
    });
    showCreateForm.value = false;
    // 切換到新建立的租戶
    await refreshAuth();
  } catch (e: any) {
    error.value = e?.message ?? "建立組織失敗";
  } finally {
    submitting.value = false;
  }
}

async function handleInviteMember() {
  if (!currentTenant.value?.id) return;

  submitting.value = true;
  error.value = null;
  try {
    await tenantMemberManager.invite({
      tenant_id: currentTenant.value.id,
      email: inviteForm.value.email,
      role: inviteForm.value.role
    });
    showInviteForm.value = false;
    await loadMembers();
  } catch (e: any) {
    error.value = e?.message ?? "邀請成員失敗";
  } finally {
    submitting.value = false;
  }
}

function editMember(member: TenantMember) {
  // TODO: 實作編輯成員角色
  console.log("編輯成員", member);
}

function confirmRemoveMember(member: TenantMember) {
  removingMember.value = member;
  // TODO: 實作確認對話框
}

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: "擁有者",
    manager: "管理者",
    staff: "員工",
    viewer: "檢視者"
  };
  return labels[role] ?? role;
}

function roleBadgeClass(role: string): string {
  const classes: Record<string, string> = {
    owner: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    staff: "bg-green-100 text-green-800",
    viewer: "bg-slate-100 text-slate-800"
  };
  return classes[role] ?? "bg-slate-100 text-slate-800";
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "啟用",
    invited: "已邀請",
    disabled: "已停用"
  };
  return labels[status] ?? status;
}

function statusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    invited: "bg-yellow-100 text-yellow-800",
    disabled: "bg-red-100 text-red-800"
  };
  return classes[status] ?? "bg-slate-100 text-slate-800";
}

function planTypeLabel(planType: string): string {
  const labels: Record<string, string> = {
    free: "免費版",
    standard: "標準版",
    pro: "專業版"
  };
  return labels[planType] ?? planType;
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

onMounted(() => {
  loadMembers();
});
</script>

