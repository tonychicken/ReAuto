/**
 * 圖片上傳 Composable
 * 使用 Supabase Storage 上傳圖片
 */

import { ref } from "vue";
import { supabaseClient } from "@core";

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  maxSize?: number; // MB
  allowedTypes?: string[];
}

export function useImageUpload() {
  const uploading = ref(false);
  const error = ref<string | null>(null);

  async function uploadImage(options: UploadOptions): Promise<string> {
    uploading.value = true;
    error.value = null;

    try {
      // 檢查檔案大小
      const maxSize = (options.maxSize ?? 10) * 1024 * 1024; // 預設 10MB
      if (options.file.size > maxSize) {
        throw new Error(`檔案大小超過 ${options.maxSize}MB 限制`);
      }

      // 檢查檔案類型
      const allowedTypes = options.allowedTypes ?? ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(options.file.type)) {
        throw new Error(`不支援的檔案類型，僅支援：${allowedTypes.join(", ")}`);
      }

      // 產生唯一檔名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const extension = options.file.name.split(".").pop();
      const fileName = `${timestamp}-${randomStr}.${extension}`;
      const filePath = `${options.path}/${fileName}`;

      // 上傳到 Supabase Storage
      const { data, error: uploadError } = await supabaseClient.storage
        .from(options.bucket)
        .upload(filePath, options.file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // 取得公開 URL
      const { data: urlData } = supabaseClient.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("無法取得圖片 URL");
      }

      return urlData.publicUrl;
    } catch (e: any) {
      error.value = e?.message ?? "上傳失敗";
      throw e;
    } finally {
      uploading.value = false;
    }
  }

  async function deleteImage(bucket: string, path: string): Promise<void> {
    try {
      const { error: deleteError } = await supabaseClient.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw deleteError;
      }
    } catch (e: any) {
      error.value = e?.message ?? "刪除失敗";
      throw e;
    }
  }

  return {
    uploading,
    error,
    uploadImage,
    deleteImage
  };
}

