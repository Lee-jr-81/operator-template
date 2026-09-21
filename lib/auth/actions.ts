"use server";

import { redirect } from "next/navigation";
import {
  hasLoginFieldErrors,
  SAFE_LOGIN_ERROR_MESSAGE,
  validateLoginInput,
  type LoginFieldErrors,
} from "@/lib/auth/login-validation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  fieldErrors?: LoginFieldErrors;
  formError?: string;
} | null;

export async function signIn(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fieldErrors = validateLoginInput(email, password);

  if (hasLoginFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error("Operator sign-in failed", { code: error.code });
    return { formError: SAFE_LOGIN_ERROR_MESSAGE };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
