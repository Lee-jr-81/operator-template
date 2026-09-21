import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getOperatorClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function requireOperator() {
  const claims = await getOperatorClaims();

  if (!claims) {
    redirect("/login");
  }

  return claims;
}
