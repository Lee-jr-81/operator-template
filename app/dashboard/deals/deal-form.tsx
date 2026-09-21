"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toDatetimeLocalValue } from "@/lib/deals/format";
import {
  createDeal,
  updateDeal,
  type DealFormState,
} from "@/server/deals/actions";
import {
  DEAL_DESCRIPTION_MAX,
  DEAL_HEADLINE_MAX,
  DEAL_PROMO_CODE_MAX,
} from "@/server/deals/validation";
import type { Deal, DealListingOption } from "@/server/deals/types";

type DealFormProps = {
  deal?: Deal;
  listings: DealListingOption[];
};

export function DealForm({ deal, listings }: DealFormProps) {
  const isEditing = Boolean(deal);
  const action = isEditing ? updateDeal : createDeal;
  const [state, formAction, pending] = useActionState<DealFormState, FormData>(
    action,
    null,
  );
  const [listingId, setListingId] = useState(deal?.listing_id ?? "");
  const selectedListing = listings.find((listing) => listing.id === listingId);

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {isEditing ? <input type="hidden" name="id" value={deal?.id} /> : null}

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="listing_id">Listing</Label>
          <p id="listing-help" className="text-sm text-(--dash-muted-fg)">
            Attach this Deal to one Listing. You can prepare a Deal before the
            Listing is active; it will not appear publicly until both are live.
          </p>
          <Select
            id="listing_id"
            name="listing_id"
            value={listingId}
            onChange={(event) => setListingId(event.target.value)}
            required
            aria-describedby="listing-help listing-context"
            aria-invalid={Boolean(state?.fieldErrors?.listing_id)}
          >
            <option value="">Choose a Listing</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title} — {listing.entity_name}
              </option>
            ))}
          </Select>
          {selectedListing ? (
            <p id="listing-context" className="text-sm text-(--dash-muted-fg)">
              {selectedListing.title}
              <span aria-hidden="true"> · </span>
              {selectedListing.entity_name}
              <span aria-hidden="true"> · </span>
              {selectedListing.category_name}
              {selectedListing.status !== "active" ? (
                <>
                  <span aria-hidden="true"> · </span>
                  Inactive Listing — this Deal stays hidden until the Listing
                  is activated
                </>
              ) : null}
            </p>
          ) : (
            <p id="listing-context" className="sr-only">
              Choose a Listing to see its Entity and Category.
            </p>
          )}
          {state?.fieldErrors?.listing_id ? (
            <FormError>{state.fieldErrors.listing_id}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <p id="headline-help" className="text-sm text-(--dash-muted-fg)">
            The main offer visitors will see. Keep it short and specific.
          </p>
          <Input
            id="headline"
            name="headline"
            defaultValue={deal?.headline ?? ""}
            required
            maxLength={DEAL_HEADLINE_MAX}
            aria-describedby="headline-help"
            aria-invalid={Boolean(state?.fieldErrors?.headline)}
          />
          {state?.fieldErrors?.headline ? (
            <FormError>{state.fieldErrors.headline}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <p id="description-help" className="text-sm text-(--dash-muted-fg)">
            Explain what the visitor gets and anything they need to know to
            claim the offer.
          </p>
          <Textarea
            id="description"
            name="description"
            defaultValue={deal?.description ?? ""}
            required
            maxLength={DEAL_DESCRIPTION_MAX}
            rows={6}
            aria-describedby="description-help"
            aria-invalid={Boolean(state?.fieldErrors?.description)}
          />
          {state?.fieldErrors?.description ? (
            <FormError>{state.fieldErrors.description}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="promo_code">Promo code</Label>
          <p id="promo-help" className="text-sm text-(--dash-muted-fg)">
            Optional. Add a code if the Entity needs customers to quote one
            when booking or buying.
          </p>
          <Input
            id="promo_code"
            name="promo_code"
            defaultValue={deal?.promo_code ?? ""}
            maxLength={DEAL_PROMO_CODE_MAX}
            aria-describedby="promo-help"
            aria-invalid={Boolean(state?.fieldErrors?.promo_code)}
          />
          {state?.fieldErrors?.promo_code ? (
            <FormError>{state.fieldErrors.promo_code}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="starts_at">Start date and time</Label>
          <p id="start-help" className="text-sm text-(--dash-muted-fg)">
            Optional. Leave empty to make the Deal eligible as soon as it is
            active.
          </p>
          <Input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(deal?.starts_at ?? null)}
            aria-describedby="start-help"
            aria-invalid={Boolean(state?.fieldErrors?.starts_at)}
          />
          {state?.fieldErrors?.starts_at ? (
            <FormError>{state.fieldErrors.starts_at}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expires_at">Expiry date and time</Label>
          <p id="expiry-help" className="text-sm text-(--dash-muted-fg)">
            The Deal will automatically stop appearing publicly after this
            time.
          </p>
          <Input
            id="expires_at"
            name="expires_at"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(deal?.expires_at ?? null)}
            required
            aria-describedby="expiry-help"
            aria-invalid={Boolean(state?.fieldErrors?.expires_at)}
          />
          {state?.fieldErrors?.expires_at ? (
            <FormError>{state.fieldErrors.expires_at}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="is_active">Active</Label>
          <p id="active-help" className="text-sm text-(--dash-muted-fg)">
            Inactive Deals stay in the dashboard but never appear on the
            public site.
          </p>
          <label className="flex items-center gap-2 text-sm text-(--dash-fg)">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              value="true"
              defaultChecked={deal?.is_active ?? true}
              aria-describedby="active-help"
              className="size-4 rounded border-(--dash-border)"
            />
            This Deal is active
          </label>
        </div>
      </div>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? "Save Deal"
            : "Create Deal"}
      </Button>
    </form>
  );
}
