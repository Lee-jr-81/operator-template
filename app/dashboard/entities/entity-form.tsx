"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  createEntity,
  updateEntity,
  type EntityFormState,
} from "@/server/entities/actions";
import { generateEntitySlug } from "@/server/entities/slug";
import type { Entity } from "@/server/entities/types";
import type { Location } from "@/server/locations/types";
import { term } from "@/config/terminology";
import {
  LOCATION_ADDRESS_MAX,
  LOCATION_COUNTRY_MAX,
  LOCATION_COUNTY_MAX,
  LOCATION_LABEL_MAX,
  LOCATION_TOWN_MAX,
} from "@/server/locations/validation";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationGeocodeFields } from "@/app/dashboard/entities/location-geocode-fields";

type EntityFormProps = {
  entity?: Entity;
  location?: Location | null;
  logoUrl?: string | null;
};

function VisibilityCheckbox({
  id,
  name,
  label,
  defaultChecked,
}: {
  id: string;
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-2 text-sm text-(--dash-muted-fg)">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-(--dash-border)"
      />
      <span>{label}</span>
    </label>
  );
}

export function EntityForm({ entity, location, logoUrl }: EntityFormProps) {
  const isEditing = Boolean(entity);
  const action = isEditing ? updateEntity : createEntity;
  const [state, formAction, pending] = useActionState<EntityFormState, FormData>(
    action,
    null,
  );

  const [name, setName] = useState(entity?.name ?? "");
  const [slug, setSlug] = useState(entity?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const slugValue = slugEdited ? slug : generateEntitySlug(name);
  const [showLocation, setShowLocation] = useState(Boolean(location));

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {isEditing ? <input type="hidden" name="id" value={entity?.id} /> : null}

      <fieldset className="space-y-5">
        <legend className="text-base font-medium text-(--dash-fg)">Identity</legend>

        <div className="space-y-1.5">
          <Label htmlFor="name">Entity name</Label>
          <p id="name-help" className="text-sm text-(--dash-muted-fg)">
            The business, provider, person or organisation responsible for future
            Listings.
          </p>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
            aria-describedby="name-help"
            aria-invalid={Boolean(state?.fieldErrors?.name)}
          />
          {state?.fieldErrors?.name ? (
            <FormError>{state.fieldErrors.name}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <p id="slug-help" className="text-sm text-(--dash-muted-fg)">
            A stable identifier for this Entity. It is not a public profile URL
            yet.
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
            maxLength={80}
            aria-describedby="slug-help"
            aria-invalid={Boolean(state?.fieldErrors?.slug)}
          />
          {state?.fieldErrors?.slug ? (
            <FormError>{state.fieldErrors.slug}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="logo">Logo</Label>
          <p id="logo-help" className="text-sm text-(--dash-muted-fg)">
            Optional. JPEG, PNG or WebP, up to 2MB. This can later appear next to
            Listings.
          </p>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-md border border-(--dash-border) object-cover"
            />
          ) : null}
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="logo-help"
            aria-invalid={Boolean(state?.fieldErrors?.logo)}
          />
          {isEditing && logoUrl ? (
            <VisibilityCheckbox
              id="remove_logo"
              name="remove_logo"
              label="Remove the current logo"
              defaultChecked={false}
            />
          ) : null}
          {state?.fieldErrors?.logo ? (
            <FormError>{state.fieldErrors.logo}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="public_description">Public description</Label>
          <p id="public-description-help" className="text-sm text-(--dash-muted-fg)">
            A short description that can later be shown alongside this Entity’s
            Listings.
          </p>
          <Textarea
            id="public_description"
            name="public_description"
            defaultValue={entity?.public_description ?? ""}
            maxLength={500}
            aria-describedby="public-description-help"
            aria-invalid={Boolean(state?.fieldErrors?.public_description)}
          />
          {state?.fieldErrors?.public_description ? (
            <FormError>{state.fieldErrors.public_description}</FormError>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-medium text-(--dash-fg)">Contact</legend>
        <p className="text-sm text-(--dash-muted-fg)">
          Contact details stay private unless you tick the box to show them on
          public Listing pages.
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="contact_name">Contact name</Label>
          <p id="contact-name-help" className="text-sm text-(--dash-muted-fg)">
            Your contact at this Entity. This is for your operator records and is
            not shown publicly.
          </p>
          <Input
            id="contact_name"
            name="contact_name"
            defaultValue={entity?.contact_name ?? ""}
            maxLength={80}
            aria-describedby="contact-name-help"
            aria-invalid={Boolean(state?.fieldErrors?.contact_name)}
          />
          {state?.fieldErrors?.contact_name ? (
            <FormError>{state.fieldErrors.contact_name}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={entity?.email ?? ""}
            maxLength={254}
            aria-invalid={Boolean(state?.fieldErrors?.email)}
          />
          <VisibilityCheckbox
            id="show_email"
            name="show_email"
            label="Show this email on future public Listing pages"
            defaultChecked={entity?.show_email ?? false}
          />
          {state?.fieldErrors?.email ? (
            <FormError>{state.fieldErrors.email}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={entity?.phone ?? ""}
            maxLength={30}
            aria-invalid={Boolean(state?.fieldErrors?.phone)}
          />
          <VisibilityCheckbox
            id="show_phone"
            name="show_phone"
            label="Show this phone number on future public Listing pages"
            defaultChecked={entity?.show_phone ?? false}
          />
          {state?.fieldErrors?.phone ? (
            <FormError>{state.fieldErrors.phone}</FormError>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website</Label>
          <Input
            id="website_url"
            name="website_url"
            type="url"
            placeholder="https://"
            defaultValue={entity?.website_url ?? ""}
            maxLength={200}
            aria-invalid={Boolean(state?.fieldErrors?.website_url)}
          />
          <VisibilityCheckbox
            id="show_website"
            name="show_website"
            label="Show this website on future public Listing pages"
            defaultChecked={entity?.show_website ?? false}
          />
          {state?.fieldErrors?.website_url ? (
            <FormError>{state.fieldErrors.website_url}</FormError>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-medium text-(--dash-fg)">Location</legend>
        <p className="text-sm text-(--dash-muted-fg)">
          Where is this Entity based? Location is optional. Street address stays
          off public pages; town and county can appear on Listings. In this UK
          clone, Find location turns a postcode into map coordinates.
        </p>

        {showLocation ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="label">Label</Label>
              <p id="label-help" className="text-sm text-(--dash-muted-fg)">
                Optional. For example Main Service Area or Training Centre.
              </p>
              <Input
                id="label"
                name="label"
                defaultValue={location?.label ?? ""}
                maxLength={LOCATION_LABEL_MAX}
                aria-describedby="label-help"
                aria-invalid={Boolean(state?.fieldErrors?.label)}
              />
              {state?.fieldErrors?.label ? (
                <FormError>{state.fieldErrors.label}</FormError>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address_line_1">Address line 1</Label>
              <Input
                id="address_line_1"
                name="address_line_1"
                defaultValue={location?.address_line_1 ?? ""}
                maxLength={LOCATION_ADDRESS_MAX}
                aria-invalid={Boolean(state?.fieldErrors?.address_line_1)}
              />
              {state?.fieldErrors?.address_line_1 ? (
                <FormError>{state.fieldErrors.address_line_1}</FormError>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address_line_2">Address line 2</Label>
              <Input
                id="address_line_2"
                name="address_line_2"
                defaultValue={location?.address_line_2 ?? ""}
                maxLength={LOCATION_ADDRESS_MAX}
                aria-invalid={Boolean(state?.fieldErrors?.address_line_2)}
              />
              {state?.fieldErrors?.address_line_2 ? (
                <FormError>{state.fieldErrors.address_line_2}</FormError>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="town_city">Town / City</Label>
              <Input
                id="town_city"
                name="town_city"
                defaultValue={location?.town_city ?? ""}
                maxLength={LOCATION_TOWN_MAX}
                aria-invalid={Boolean(state?.fieldErrors?.town_city)}
              />
              {state?.fieldErrors?.town_city ? (
                <FormError>{state.fieldErrors.town_city}</FormError>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="county_region">County / Region</Label>
              <Input
                id="county_region"
                name="county_region"
                defaultValue={location?.county_region ?? ""}
                maxLength={LOCATION_COUNTY_MAX}
                aria-invalid={Boolean(state?.fieldErrors?.county_region)}
              />
              {state?.fieldErrors?.county_region ? (
                <FormError>{state.fieldErrors.county_region}</FormError>
              ) : null}
            </div>

            <LocationGeocodeFields
              defaultPostcode={location?.postcode ?? ""}
              defaultLatitude={location?.latitude}
              defaultLongitude={location?.longitude}
              fieldErrors={state?.fieldErrors}
            />

            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                defaultValue={location?.country ?? ""}
                placeholder="United Kingdom"
                maxLength={LOCATION_COUNTRY_MAX}
                aria-invalid={Boolean(state?.fieldErrors?.country)}
              />
              {state?.fieldErrors?.country ? (
                <FormError>{state.fieldErrors.country}</FormError>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowLocation(false)}
            >
              Remove location
            </Button>
          </>
        ) : (
          <>
            {location ? (
              <input type="hidden" name="remove_location" value="on" />
            ) : null}
            <p className="text-sm text-(--dash-muted-fg)">
              No location added. Add the Entity’s main location so visitors can
              understand where they operate.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowLocation(true)}
            >
              Add location
            </Button>
          </>
        )}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-medium text-(--dash-fg)">
          Operator notes
        </legend>
        <div className="space-y-1.5">
          <Label htmlFor="operator_notes">Private relationship notes</Label>
          <p id="notes-help" className="text-sm text-(--dash-muted-fg)">
            Private notes about your relationship with this Entity. These are
            never shown on the public site.
          </p>
          <Textarea
            id="operator_notes"
            name="operator_notes"
            defaultValue={entity?.operator_notes ?? ""}
            maxLength={2000}
            aria-describedby="notes-help"
            aria-invalid={Boolean(state?.fieldErrors?.operator_notes)}
          />
          {state?.fieldErrors?.operator_notes ? (
            <FormError>{state.fieldErrors.operator_notes}</FormError>
          ) : null}
        </div>
      </fieldset>

      {state?.formError ? <FormError>{state.formError}</FormError> : null}

      <Button type="submit" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? `Save ${term("entity", "singular")}`
            : `Add ${term("entity", "singular")}`}
      </Button>
    </form>
  );
}
