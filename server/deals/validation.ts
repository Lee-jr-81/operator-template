import {
  dealWindowsOverlap,
  type DealLifecycleFields,
} from "@/lib/deals/current";
import type { DealFieldErrors, DealInput } from "@/server/deals/types";

export const DEAL_HEADLINE_MAX = 120;
export const DEAL_DESCRIPTION_MAX = 2000;
export const DEAL_PROMO_CODE_MAX = 40;

export const DEAL_SAVE_FAILED_MESSAGE =
  "The Deal could not be saved. Please try again.";

export const DEAL_OVERLAP_MESSAGE =
  "This Listing already has an active Deal in that date window. Deactivate or expire the other Deal first.";

export function hasDealFieldErrors(fieldErrors: DealFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

function parseTimestamp(value: string): Date | null | "invalid" {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return "invalid";
  }

  return date;
}

export function parseDealInput(
  raw: {
    listing_id: string;
    headline: string;
    description: string;
    promo_code: string;
    starts_at: string;
    expires_at: string;
    is_active: string;
  },
  options: { requireFutureExpiry: boolean; now?: Date } = {
    requireFutureExpiry: false,
  },
): { data: DealInput } | { fieldErrors: DealFieldErrors } {
  const listingId = raw.listing_id.trim();
  const headline = raw.headline.trim();
  const description = raw.description.trim();
  const promoCode = raw.promo_code.trim();
  const startsAt = parseTimestamp(raw.starts_at);
  const expiresAt = parseTimestamp(raw.expires_at);
  const now = options.now ?? new Date();
  const fieldErrors: DealFieldErrors = {};

  if (!listingId) {
    fieldErrors.listing_id = "Choose a Listing.";
  }

  if (!headline) {
    fieldErrors.headline = "Enter a Deal headline.";
  } else if (headline.length > DEAL_HEADLINE_MAX) {
    fieldErrors.headline = `Use ${DEAL_HEADLINE_MAX} characters or fewer.`;
  }

  if (!description) {
    fieldErrors.description = "Explain what the visitor gets.";
  } else if (description.length > DEAL_DESCRIPTION_MAX) {
    fieldErrors.description = `Use ${DEAL_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (promoCode.length > DEAL_PROMO_CODE_MAX) {
    fieldErrors.promo_code = `Use ${DEAL_PROMO_CODE_MAX} characters or fewer.`;
  }

  if (startsAt === "invalid") {
    fieldErrors.starts_at = "Enter a valid start date and time.";
  }

  if (expiresAt === null) {
    fieldErrors.expires_at = "Enter an expiry date and time.";
  } else if (expiresAt === "invalid") {
    fieldErrors.expires_at = "Enter a valid expiry date and time.";
  } else if (
    startsAt instanceof Date &&
    expiresAt.getTime() <= startsAt.getTime()
  ) {
    fieldErrors.expires_at = "Expiry must be after the start date.";
  } else if (
    options.requireFutureExpiry &&
    expiresAt.getTime() <= now.getTime()
  ) {
    fieldErrors.expires_at = "Expiry must be in the future.";
  }

  if (hasDealFieldErrors(fieldErrors) || !(expiresAt instanceof Date)) {
    return { fieldErrors };
  }

  return {
    data: {
      listing_id: listingId,
      headline,
      description,
      promo_code: promoCode || null,
      starts_at: startsAt instanceof Date ? startsAt.toISOString() : null,
      expires_at: expiresAt.toISOString(),
      is_active: raw.is_active === "true",
    },
  };
}

export function overlappingActiveDealError(
  candidate: Pick<DealLifecycleFields, "is_active" | "starts_at" | "expires_at">,
  existing: Array<DealLifecycleFields & { id?: string }>,
  excludeId?: string,
) {
  if (!candidate.is_active) {
    return undefined;
  }

  const conflict = existing.some((deal) => {
    if (!deal.is_active) {
      return false;
    }

    if (excludeId && deal.id === excludeId) {
      return false;
    }

    return dealWindowsOverlap(candidate, deal);
  });

  return conflict ? DEAL_OVERLAP_MESSAGE : undefined;
}

export function toPublicDeal(deal: {
  id: string;
  headline: string;
  description: string;
  promo_code: string | null;
  starts_at: string | null;
  expires_at: string;
}) {
  return {
    id: deal.id,
    headline: deal.headline,
    description: deal.description,
    promo_code: deal.promo_code,
    starts_at: deal.starts_at,
    expires_at: deal.expires_at,
  };
}
