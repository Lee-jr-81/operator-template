import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/env";

export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!secret) {
    return null;
  }

  const { url } = getSupabasePublicEnv();
  return createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
