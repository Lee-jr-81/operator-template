"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signIn,
    null,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={Boolean(state?.fieldErrors?.email)}
          aria-describedby={state?.fieldErrors?.email ? "email-error" : undefined}
        />
        {state?.fieldErrors?.email ? (
          <FormError id="email-error">{state.fieldErrors.email}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state?.fieldErrors?.password)}
          aria-describedby={
            state?.fieldErrors?.password ? "password-error" : undefined
          }
        />
        {state?.fieldErrors?.password ? (
          <FormError id="password-error">{state.fieldErrors.password}</FormError>
        ) : null}
      </div>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
