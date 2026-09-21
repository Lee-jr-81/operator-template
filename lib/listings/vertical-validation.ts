import {
  DURATION_TEXT_MAX,
  PRICE_TEXT_MAX,
  SERVICE_FORMAT_MAX,
  type ListingDetailsFieldErrors,
  type ListingDetailsInput,
} from "@/lib/listings/vertical";

export function hasListingDetailsFieldErrors(
  fieldErrors: ListingDetailsFieldErrors,
) {
  return Object.values(fieldErrors).some(Boolean);
}

export function parseListingDetailsInput(raw: {
  service_format: string;
  price_text: string;
  duration_text: string;
}): { data: ListingDetailsInput } | { fieldErrors: ListingDetailsFieldErrors } {
  const service_format = raw.service_format.trim();
  const price_text = raw.price_text.trim();
  const duration_text = raw.duration_text.trim();
  const fieldErrors: ListingDetailsFieldErrors = {};

  if (service_format.length > SERVICE_FORMAT_MAX) {
    fieldErrors.service_format = `Use ${SERVICE_FORMAT_MAX} characters or fewer.`;
  }

  if (price_text.length > PRICE_TEXT_MAX) {
    fieldErrors.price_text = `Use ${PRICE_TEXT_MAX} characters or fewer.`;
  }

  if (duration_text.length > DURATION_TEXT_MAX) {
    fieldErrors.duration_text = `Use ${DURATION_TEXT_MAX} characters or fewer.`;
  }

  if (hasListingDetailsFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  return { data: { service_format, price_text, duration_text } };
}
