"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TERMINOLOGY } from "@/config/terminology";
import {
  submitJoinRequest,
  type JoinFormState,
} from "@/server/contact/join-actions";
import {
  JOIN_EMAIL_MAX,
  JOIN_MESSAGE_MAX,
  JOIN_NAME_MAX,
  JOIN_PHONE_MAX,
} from "@/server/contact/join-validation";

export function JoinForm() {
  const [state, formAction, pending] = useActionState<JoinFormState, FormData>(
    submitJoinRequest,
    null,
  );

  if (state?.success) {
    return (
      <div role="status" className="rounded-lg border border-(--public-border) bg-white p-6">
        <h2 className="text-lg font-medium">Message sent</h2>
        <p className="mt-2 text-sm leading-6 text-(--public-text-muted)">
          Thanks. We have your message and will reply by email.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="join-name">Name</Label>
        <Input
          id="join-name"
          name="name"
          autoComplete="name"
          required
          maxLength={JOIN_NAME_MAX}
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.name)}
        />
        {state?.fieldErrors?.name ? (
          <FormError>{state.fieldErrors.name}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="join-email">Email</Label>
        <Input
          id="join-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={JOIN_EMAIL_MAX}
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.email)}
        />
        {state?.fieldErrors?.email ? (
          <FormError>{state.fieldErrors.email}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="join-phone">Phone (optional)</Label>
        <Input
          id="join-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={JOIN_PHONE_MAX}
          disabled={pending}
          aria-invalid={Boolean(state?.fieldErrors?.phone)}
        />
        {state?.fieldErrors?.phone ? (
          <FormError>{state.fieldErrors.phone}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="join-message">Message</Label>
        <p id="join-message-help" className="text-sm text-(--public-text-muted)">
          Tell us about the {TERMINOLOGY.listing.plural.toLowerCase()} you would
          like to add.
        </p>
        <Textarea
          id="join-message"
          name="message"
          required
          rows={6}
          maxLength={JOIN_MESSAGE_MAX}
          disabled={pending}
          aria-describedby="join-message-help"
          aria-invalid={Boolean(state?.fieldErrors?.message)}
        />
        {state?.fieldErrors?.message ? (
          <FormError>{state.fieldErrors.message}</FormError>
        ) : null}
      </div>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
