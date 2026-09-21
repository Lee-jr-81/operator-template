import type { ListingDetailsInput } from "@/lib/listings/vertical";
import {
  LISTING_SLUG_MAX,
  LISTING_TITLE_MAX,
  generateListingSlug,
} from "@/server/listings/slug";
import type { Listing, ListingInput } from "@/server/listings/types";

export function duplicatedListingTitle(title: string) {
  const prefixed = `Copy of ${title}`.trim();
  if (prefixed.length <= LISTING_TITLE_MAX) {
    return prefixed;
  }

  return prefixed.slice(0, LISTING_TITLE_MAX).trim();
}

export function listingSlugAttempt(baseSlug: string, attempt: number) {
  if (attempt <= 1) {
    return baseSlug.slice(0, LISTING_SLUG_MAX);
  }

  const suffix = `-${attempt}`;
  const maxBase = LISTING_SLUG_MAX - suffix.length;
  const trimmed = baseSlug.slice(0, Math.max(1, maxBase)).replace(/-+$/g, "");
  return `${trimmed}${suffix}`;
}

export function buildDuplicatedListing(
  source: Listing,
  details: ListingDetailsInput,
): { listing: ListingInput; details: ListingDetailsInput } {
  const title = duplicatedListingTitle(source.title);

  return {
    listing: {
      title,
      slug: generateListingSlug(title),
      summary: source.summary,
      description: source.description,
      category_id: source.category_id,
      entity_id: source.entity_id,
      status: "inactive",
      is_featured: false,
      seo_title: source.seo_title,
      seo_description: source.seo_description,
    },
    details: {
      service_format: details.service_format,
      price_text: details.price_text,
      duration_text: details.duration_text,
    },
  };
}
