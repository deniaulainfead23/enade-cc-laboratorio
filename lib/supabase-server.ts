import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export function createStudentContext(request: Request): Promise<{ client: SupabaseClient; user: User } | null> {
  return (async () => {
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!token || !url || !key) return null;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data, error } = await client.auth.getUser(token);
    return error || !data.user ? null : { client, user: data.user };
  })();
}
