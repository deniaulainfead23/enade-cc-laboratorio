import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && key);
export const supabase = url && key ? createClient(url, key, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } }) : null;

export async function getAuthHeaders(extra: HeadersInit = {}): Promise<HeadersInit> {
  const { data } = await supabase?.auth.getSession() ?? { data: { session: null } };
  const headers = new Headers(extra);
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return headers;
}
