import {
  CATEGORY_DESCRIPTION_MAX,
  CATEGORY_NAME_MAX,
  generateCategorySlug,
  isValidCategorySlug,
} from "@/server/categories/slug";
import type { CategoryFieldErrors, CategoryInput } from "@/server/categories/types";

export function hasCategoryFieldErrors(fieldErrors: CategoryFieldErrors) {
  return Boolean(
    fieldErrors.name ||
      fieldErrors.slug ||
      fieldErrors.description ||
      fieldErrors.image,
  );
}

export function parseCategoryInput(raw: {
  name: string;
  slug: string;
  description: string;
}): { data: CategoryInput } | { fieldErrors: CategoryFieldErrors } {
  const name = raw.name.trim();
  const description = raw.description.trim();
  const slug = generateCategorySlug(raw.slug) || generateCategorySlug(name);

  const fieldErrors: CategoryFieldErrors = {};

  if (!name) {
    fieldErrors.name = "Enter a Category name.";
  } else if (name.length > CATEGORY_NAME_MAX) {
    fieldErrors.name = `Use ${CATEGORY_NAME_MAX} characters or fewer.`;
  }

  if (!slug) {
    fieldErrors.slug =
      "Enter a URL-safe slug, or use a name that can generate one.";
  } else if (!isValidCategorySlug(slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and hyphens only. Do not start or end with a hyphen.";
  }

  if (!description) {
    fieldErrors.description =
      "Enter a short description for the public Category page.";
  } else if (description.length > CATEGORY_DESCRIPTION_MAX) {
    fieldErrors.description = `Use ${CATEGORY_DESCRIPTION_MAX} characters or fewer.`;
  }

  if (hasCategoryFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  return { data: { name, slug, description } };
}

export function isUniqueSlugError(error: { code?: string } | null) {
  return error?.code === "23505";
}

export function isRestrictDeleteError(error: { code?: string } | null) {
  return error?.code === "23503";
}

export const DUPLICATE_SLUG_MESSAGE =
  "That slug is already used by another Category. Choose a different one.";

export const CATEGORY_SAVE_FAILED_MESSAGE =
  "The Category could not be saved. Please try again.";
