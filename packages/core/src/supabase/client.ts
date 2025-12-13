import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // 在開發階段幫忙提醒環境變數沒設定
  // eslint-disable-next-line no-console
  console.warn("[core:supabase] 缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);


