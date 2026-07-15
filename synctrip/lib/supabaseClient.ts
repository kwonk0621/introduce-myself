import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isUrlValid = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

export const supabase = (supabaseUrl && supabaseAnonKey && isUrlValid(supabaseUrl))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
