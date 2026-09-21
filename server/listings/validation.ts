import {
  LISTING_DESCRIPTION_MAX,
  LISTING_SEO_DESCRIPTION_MAX,
  LISTING_SEO_TITLE_MAX,
  LISTING_SUMMARY_MAX,
  LISTING_TITLE_MAX,
  generateListingSlug,
  isValidListingSlug,
} from "@/server/listings/slug";
import { isListingStatus } from "@/server/listings/status";
import type { ListingFieldErrors, ListingInput } from "@/server/listings/types";

export function parseListingFeaturedFlag(raw: string) {
  return raw === "true";
}

export function hasListingFieldErrors(fieldErrors: ListingFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

export function listingRelationshipErrors(options: {
  categoryExists: boolean;
  entityExists: boolean;
}): ListingFieldErrors {
  const fieldErrors: ListingFieldErrors = {};

  if (!options.categoryExists) {
    fieldErrors.category_id = "Choose a valid Category.";
  }

  if (!options.entityExists) {
    fieldErrors.entity_id = "Choose a valid Entity.";
  }

  return fieldErrors;
}

export function parseListingInput(raw: {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category_id: string;
  entity_id: string;
  status: string;
  is_featured: string;
  seo_title: string;
  seo_description: string;
}): { data: ListingInput } | { fieldErrors: ListingFieldErrors } {
  const title = raw.title.trim();
  const summary = raw.summary.trim();
  const description = raw.description.trim();
  const categoryId = raw.category_id.trim();
  const entityId = raw.entity_id.trim();
  const seoTitle = raw.seo_title.trim();
  const seoDescription = raw.seo_description.trim();
  const slug = generateListingSlug(raw.slug) || generateListingSlug(title);
  const fieldErrors: ListingFieldErrors = {};

  if (!title) {
    fieldErrors.title = "Enter a Listing title.";
  } else if (title.length > LISTING_TITLE_MAX) {
    fieldErrors.title = `Use ${LISTING_TITLE_MAX} characters or fewer.`;
  }

  if (!slug) {
    fieldErrors.slug =
      "Enter a URL-safe slug, or use a title that can generate one.";
  } else if (!isValidListingSlug(slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and hyphens only. Do not start or end with a hyphen.";
  }

  if (!summary) {
    fieldErrors.summary = "Enter a short summary for cards and search.";
  } else if (summary.length > LISTING_SUMMARY_MAX) {
    fieldErrors.summary = `Use ${LISTING_SUMMARY_MAX} characters or fewer.`;
  }

  if (description.length > LISTING_DESCRIPTION_MAX) {
    fieldErrors.description = `Use ${LISTING_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (!categoryId) {
    fieldErrors.category_id = "Choose a Category.";
  }

  if (!entityId) {
    fieldErrors.entity_id = "Choose an Entity.";
  }

  if (!isListingStatus(raw.status)) {
    fieldErrors.status = "Choose Active or Inactive.";
  }

  if (seoTitle.length > LISTING_SEO_TITLE_MAX) {
    fieldErrors.seo_title = `Use ${LISTING_SEO_TITLE_MAX} characters or fewer.`;
  }

  if (seoDescription.length > LISTING_SEO_DESCRIPTION_MAX) {
    fieldErrors.seo_description = `Use ${LISTING_SEO_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (hasListingFieldErrors(fieldErrors) || !isListingStatus(raw.status)) {
    return { fieldErrors };
  }

  return {
    data: {
      title,
      slug,
      summary,
      description,
      category_id: categoryId,
      entity_id: entityId,
      status: raw.status,
      is_featured: parseListingFeaturedFlag(raw.is_featured),
      seo_title: seoTitle,
      seo_description: seoDescription,
    },
  };
}

export function isUniqueSlugError(error: { code?: string } | null) {
  return error?.code === "23505";
}

export function isRestrictDeleteError(error: { code?: string } | null) {
  return error?.code === "23503";
}

export const DUPLICATE_SLUG_MESSAGE =
  "That slug is already used by another Listing. Choose a different one.";

export const LISTING_SAVE_FAILED_MESSAGE =
  "The Listing could not be saved. Please try again.";
