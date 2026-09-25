"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitEnquiry,
  type EnquiryFormState,
} from "@/server/enquiries/actions";
import {
  ENQUIRY_EMAIL_MAX,
  ENQUIRY_MESSAGE_MAX,
  ENQUIRY_NAME_MAX,
  ENQUIRY_PHONE_MAX,
} from "@/server/enquiries/validation";

export function EnquiryForm({
  listingId,
  listingTitle,
  entityName,
}: {
  listingId: string;
  listingTitle: string;
  entityName: string;
}) {
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    submitEnquiry,
    null,
  );

  if (state?.success) {
    return (
      <div role="status" className="rounded-lg border border-(--public-border) bg-white p-6">
        <h2 className="text-lg font-medium">Enquiry sent</h2>
        <p className="mt-2 text-sm leading-6 text-(--public-text-muted)">
          Thanks — your enquiry has been received.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-(--public-border) bg-white p-6">
      <h2 className="text-lg font-medium">Send an Enquiry</h2>
      <p className="mt-2 text-sm leading-6 text-(--public-text-muted)">
        The Provider will receive this by email.
      </p>
      <p className="mt-1 font-medium text-(--public-text)">{listingTitle}</p>
      <p className="text-sm text-(--public-text-muted)">{entityName}</p>

      <form action={formAction} className="mt-6 space-y-5" noValidate>
        <input type="hidden" name="listing_id" value={listingId} />
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
          <Label htmlFor="enquiry-name">Name</Label>
          <Input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            required
            maxLength={ENQUIRY_NAME_MAX}
            disabled={pending}
            aria-invalid={Boolean(state?.fieldErrors?.name)}
          />
          {state?.fieldErrors?.name ? (
            <FormError>{state.fieldErrors.name}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-email">Email</Label>
          <Input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={ENQUIRY_EMAIL_MAX}
            disabled={pending}
            aria-invalid={Boolean(state?.fieldErrors?.email)}
          />
          {state?.fieldErrors?.email ? (
            <FormError>{state.fieldErrors.email}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-phone">Phone (optional)</Label>
          <Input
            id="enquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={ENQUIRY_PHONE_MAX}
            disabled={pending}
            aria-invalid={Boolean(state?.fieldErrors?.phone)}
          />
          {state?.fieldErrors?.phone ? (
            <FormError>{state.fieldErrors.phone}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-message">Message</Label>
          <p id="enquiry-message-help" className="text-sm text-(--public-text-muted)">
            Tell them what you would like to know, when you need the service, or
            any questions you have.
          </p>
          <Textarea
            id="enquiry-message"
            name="message"
            required
            rows={6}
            maxLength={ENQUIRY_MESSAGE_MAX}
            disabled={pending}
            aria-describedby="enquiry-message-help"
            aria-invalid={Boolean(state?.fieldErrors?.message)}
          />
          {state?.fieldErrors?.message ? (
            <FormError>{state.fieldErrors.message}</FormError>
          ) : null}
        </div>

        {state?.formError ? <FormError>{state.formError}</FormError> : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send an Enquiry"}
        </Button>
      </form>
    </section>
  );
}
