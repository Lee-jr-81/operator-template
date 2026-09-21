export const CATEGORY_NAME_MAX = 80;
export const CATEGORY_SLUG_MAX = 80;
export const CATEGORY_DESCRIPTION_MAX = 500;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function generateCategorySlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, CATEGORY_SLUG_MAX);
}

export function isValidCategorySlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= CATEGORY_SLUG_MAX &&
    SLUG_PATTERN.test(slug)
  );
}
