"use client";

import { useActionState, useState } from "react";
import { VerticalFields } from "@/components/listings/vertical-fields";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { term } from "@/config/terminology";
import type { ListingDetailsInput } from "@/lib/listings/vertical";
import type { Category } from "@/server/categories/types";
import type { Entity } from "@/server/entities/types";
import {
  createListing,
  updateListing,
  type ListingFormState,
} from "@/server/listings/actions";
import {
  LISTING_DESCRIPTION_MAX,
  LISTING_SEO_DESCRIPTION_MAX,
  LISTING_SEO_TITLE_MAX,
  LISTING_SLUG_MAX,
  LISTING_SUMMARY_MAX,
  LISTING_TITLE_MAX,
  generateListingSlug,
} from "@/server/listings/slug";
import type { Listing } from "@/server/listings/types";

type ListingFormProps = {
  listing?: Listing;
  details?: ListingDetailsInput;
  categories: Pick<Category, "id" | "name">[];
  entities: Pick<Entity, "id" | "name">[];
};

export function ListingForm({
  listing,
  details,
  categories,
  entities,
}: ListingFormProps) {
  const isEditing = Boolean(listing);
  const action = isEditing ? updateListing : createListing;
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(
    action,
    null,
  );

  const [title, setTitle] = useState(listing?.title ?? "");
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const slugValue = slugEdited ? slug : generateListingSlug(title);

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {isEditing ? <input type="hidden" name="id" value={listing?.id} /> : null}

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-(--dash-fg)">
          Basics
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <p id="title-help" className="text-sm text-(--dash-muted-fg)">
            The public name visitors will see, such as “Sample Listing”.
          </p>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={LISTING_TITLE_MAX}
            aria-describedby="title-help"
            aria-invalid={Boolean(state?.fieldErrors?.title)}
          />
          {state?.fieldErrors?.title ? (
            <FormError>{state.fieldErrors.title}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <p id="slug-help" className="text-sm text-(--dash-muted-fg)">
            Used in the public Listing URL. Keep it short and readable.
            {isEditing
              ? " Changing it changes the public URL. Existing links will not redirect."
              : null}
          </p>
          <Input
            id="slug"
            name="slug"
            value={slugValue}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
            required
            maxLength={LISTING_SLUG_MAX}
            aria-describedby="slug-help"
            aria-invalid={Boolean(state?.fieldErrors?.slug)}
          />
          {state?.fieldErrors?.slug ? (
            <FormError>{state.fieldErrors.slug}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">Category</Label>
          <p id="category-help" className="text-sm text-(--dash-muted-fg)">
            Choose the public Category this Listing belongs to.
          </p>
          <Select
            id="category_id"
            name="category_id"
            defaultValue={listing?.category_id ?? ""}
            required
            aria-describedby="category-help"
            aria-invalid={Boolean(state?.fieldErrors?.category_id)}
          >
            <option value="">Choose a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {state?.fieldErrors?.category_id ? (
            <FormError>{state.fieldErrors.category_id}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="entity_id">Entity</Label>
          <p id="entity-help" className="text-sm text-(--dash-muted-fg)">
            Choose the business, provider or person responsible for this Listing.
          </p>
          <Select
            id="entity_id"
            name="entity_id"
            defaultValue={listing?.entity_id ?? ""}
            required
            aria-describedby="entity-help"
            aria-invalid={Boolean(state?.fieldErrors?.entity_id)}
          >
            <option value="">Choose an Entity</option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </Select>
          {state?.fieldErrors?.entity_id ? (
            <FormError>{state.fieldErrors.entity_id}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <p id="status-help" className="text-sm text-(--dash-muted-fg)">
            Inactive Listings stay in the dashboard but are hidden from the
            public site.
          </p>
          <Select
            id="status"
            name="status"
            defaultValue={listing?.status ?? "active"}
            required
            aria-describedby="status-help"
            aria-invalid={Boolean(state?.fieldErrors?.status)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          {state?.fieldErrors?.status ? (
            <FormError>{state.fieldErrors.status}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="is_featured">Featured</Label>
          <p id="featured-help" className="text-sm text-(--dash-muted-fg)">
            Feature this Listing in prominent marketplace surfaces such as the
            homepage. Inactive Featured Listings stay hidden from the public
            site until they are active again.
          </p>
          <label className="flex items-center gap-2 text-sm text-(--dash-fg)">
            <input
              id="is_featured"
              name="is_featured"
              type="checkbox"
              value="true"
              defaultChecked={listing?.is_featured ?? false}
              aria-describedby="featured-help"
              className="size-4 rounded border-(--dash-border)"
            />
            Feature this Listing
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-(--dash-fg)">
          Copy
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <p id="summary-help" className="text-sm text-(--dash-muted-fg)">
            Short copy for Listing cards. Keep it to one or two sentences.
          </p>
          <Textarea
            id="summary"
            name="summary"
            defaultValue={listing?.summary ?? ""}
            required
            maxLength={LISTING_SUMMARY_MAX}
            aria-describedby="summary-help"
            aria-invalid={Boolean(state?.fieldErrors?.summary)}
          />
          {state?.fieldErrors?.summary ? (
            <FormError>{state.fieldErrors.summary}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <p id="description-help" className="text-sm text-(--dash-muted-fg)">
            Longer public copy. Structured facts such as price belong in the
            vertical details below.
          </p>
          <Textarea
            id="description"
            name="description"
            defaultValue={listing?.description ?? ""}
            maxLength={LISTING_DESCRIPTION_MAX}
            rows={8}
            aria-describedby="description-help"
            aria-invalid={Boolean(state?.fieldErrors?.description)}
          />
          {state?.fieldErrors?.description ? (
            <FormError>{state.fieldErrors.description}</FormError>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-(--dash-fg)">
          Search
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="seo_title">SEO title</Label>
          <p id="seo-title-help" className="text-sm text-(--dash-muted-fg)">
            Optional. If empty, the Listing title is used.
          </p>
          <Input
            id="seo_title"
            name="seo_title"
            defaultValue={listing?.seo_title ?? ""}
            maxLength={LISTING_SEO_TITLE_MAX}
            aria-describedby="seo-title-help"
            aria-invalid={Boolean(state?.fieldErrors?.seo_title)}
          />
          {state?.fieldErrors?.seo_title ? (
            <FormError>{state.fieldErrors.seo_title}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo_description">SEO description</Label>
          <p id="seo-description-help" className="text-sm text-(--dash-muted-fg)">
            Optional. If empty, the Listing summary is used.
          </p>
          <Textarea
            id="seo_description"
            name="seo_description"
            defaultValue={listing?.seo_description ?? ""}
            maxLength={LISTING_SEO_DESCRIPTION_MAX}
            aria-describedby="seo-description-help"
            aria-invalid={Boolean(state?.fieldErrors?.seo_description)}
          />
          {state?.fieldErrors?.seo_description ? (
            <FormError>{state.fieldErrors.seo_description}</FormError>
          ) : null}
        </div>
      </fieldset>

      <VerticalFields details={details} fieldErrors={state?.fieldErrors} />

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? `Save ${term("listing", "singular")}`
            : `Create ${term("listing", "singular")}`}
      </Button>
    </form>
  );
}
