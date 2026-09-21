"use client";

import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DURATION_TEXT_MAX,
  PRICE_TEXT_MAX,
  SERVICE_FORMAT_MAX,
  VERTICAL_LABEL,
  type ListingDetailsFieldErrors,
  type ListingDetailsInput,
} from "@/lib/listings/vertical";

type VerticalFieldsProps = {
  details?: ListingDetailsInput;
  fieldErrors?: ListingDetailsFieldErrors;
};

export function VerticalFields({ details, fieldErrors }: VerticalFieldsProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-base font-semibold text-(--dash-fg)">
        Vertical details
      </legend>
      <p className="text-sm text-(--dash-muted-fg)">{VERTICAL_LABEL}</p>

      <div className="space-y-1.5">
        <Label htmlFor="service_format">Service format</Label>
        <p id="service-format-help" className="text-sm text-(--dash-muted-fg)">
          Example: Standard, Package, or 1-to-1.
        </p>
        <Input
          id="service_format"
          name="service_format"
          defaultValue={details?.service_format ?? ""}
          maxLength={SERVICE_FORMAT_MAX}
          aria-describedby="service-format-help"
          aria-invalid={Boolean(fieldErrors?.service_format)}
        />
        {fieldErrors?.service_format ? (
          <FormError>{fieldErrors.service_format}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price_text">Price</Label>
        <p id="price-help" className="text-sm text-(--dash-muted-fg)">
          Free text for this starter vertical, such as “From 50”. Price is not
          a generic Listing field.
        </p>
        <Input
          id="price_text"
          name="price_text"
          defaultValue={details?.price_text ?? ""}
          maxLength={PRICE_TEXT_MAX}
          aria-describedby="price-help"
          aria-invalid={Boolean(fieldErrors?.price_text)}
        />
        {fieldErrors?.price_text ? (
          <FormError>{fieldErrors.price_text}</FormError>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="duration_text">Duration</Label>
        <p id="duration-help" className="text-sm text-(--dash-muted-fg)">
          Example: 60 minutes or 6 weeks.
        </p>
        <Input
          id="duration_text"
          name="duration_text"
          defaultValue={details?.duration_text ?? ""}
          maxLength={DURATION_TEXT_MAX}
          aria-describedby="duration-help"
          aria-invalid={Boolean(fieldErrors?.duration_text)}
        />
        {fieldErrors?.duration_text ? (
          <FormError>{fieldErrors.duration_text}</FormError>
        ) : null}
      </div>
    </fieldset>
  );
}
