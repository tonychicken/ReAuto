/**
 * 權限檢查 Composable
 * 提供前端權限檢查功能
 */

import { computed } from "vue";
import { useAuth } from "./useAuth";
import { canRead, canWrite, canExecute, isOwner, isManagerOrAbove, isStaffOrAbove } from "@core";

export function usePermissions() {
  const { member } = useAuth();

  return {
    canRead: (module: Parameters<typeof canRead>[0]) => {
      if (!member.value) return false;
      return canRead(module);
    },
    canWrite: (module: Parameters<typeof canWrite>[0]) => {
      if (!member.value) return false;
      return canWrite(module);
    },
    canExecute: (module: Parameters<typeof canExecute>[0]) => {
      if (!member.value) return false;
      return canExecute(module);
    },
    isOwner: computed(() => {
      if (!member.value) return false;
      return isOwner();
    }),
    isManagerOrAbove: computed(() => {
      if (!member.value) return false;
      return isManagerOrAbove();
    }),
    isStaffOrAbove: computed(() => {
      if (!member.value) return false;
      return isStaffOrAbove();
    })
  };
}

