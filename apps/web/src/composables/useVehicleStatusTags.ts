/**
 * 車輛狀態標籤 Composable
 * 根據車輛整備狀態自動產生標籤
 */

import { computed } from "vue";

export interface VehicleDetails {
  has_detailing?: boolean;
  has_certification?: boolean;
  has_tax_certificate?: boolean;
  has_origin_certificate?: boolean;
  has_transfer_done?: boolean;
  keys_count?: number;
  expected_repair_cost?: number | null;
  repair_history?: any[] | null;
  status?: string;
}

export interface StatusTag {
  id: string;
  label: string;
  icon: string;
  priority: number;
  color: string;
}

export function useVehicleStatusTags(details: VehicleDetails) {
  const tags = computed<StatusTag[]>(() => {
    const result: StatusTag[] = [];

    // 📄 缺證明（最高優先級）
    if (!details.has_tax_certificate || !details.has_origin_certificate) {
      result.push({
        id: "missing-cert",
        label: "缺證明",
        icon: "📄",
        priority: 1,
        color: "bg-red-500"
      });
    }

    // 🔧 需維修
    if (details.expected_repair_cost && details.expected_repair_cost > 0) {
      const hasIncompleteRepairs = details.repair_history?.some(
        (r: any) => r.status !== "completed"
      );
      if (hasIncompleteRepairs) {
        result.push({
          id: "needs-repair",
          label: "需維修",
          icon: "🔧",
          priority: 2,
          color: "bg-orange-500"
        });
      }
    }

    // ⚠️ 未美容
    if (!details.has_detailing) {
      result.push({
        id: "no-detailing",
        label: "未美容",
        icon: "⚠️",
        priority: 3,
        color: "bg-yellow-500"
      });
    }

    // 🔑 缺鑰匙
    if (!details.keys_count || details.keys_count < 2) {
      result.push({
        id: "missing-keys",
        label: "缺鑰匙",
        icon: "🔑",
        priority: 4,
        color: "bg-blue-500"
      });
    }

    // 🚫 未過戶（若車輛狀態為 sold 但未過戶）
    if (details.status === "sold" && !details.has_transfer_done) {
      result.push({
        id: "no-transfer",
        label: "未過戶",
        icon: "🚫",
        priority: 5,
        color: "bg-purple-500"
      });
    }

    // ✅ 整備完成（所有必要項目都完成）
    if (
      details.has_detailing &&
      details.has_certification &&
      details.has_tax_certificate &&
      details.has_origin_certificate &&
      details.keys_count &&
      details.keys_count >= 2 &&
      (!details.expected_repair_cost || details.expected_repair_cost === 0)
    ) {
      result.push({
        id: "ready",
        label: "整備完成",
        icon: "✅",
        priority: 0,
        color: "bg-green-500"
      });
    }

    // 依優先級排序（數字越小優先級越高）
    return result.sort((a, b) => a.priority - b.priority);
  });

  const topTags = computed(() => tags.value.slice(0, 3)); // 最多顯示 3 個

  const hasWarnings = computed(() => {
    return tags.value.some((tag) => tag.priority > 0);
  });

  return {
    tags,
    topTags,
    hasWarnings
  };
}

