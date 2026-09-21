export const LISTING_TITLE_MAX = 120;
export const LISTING_SLUG_MAX = 80;
export const LISTING_SUMMARY_MAX = 200;
export const LISTING_DESCRIPTION_MAX = 4000;
export const LISTING_SEO_TITLE_MAX = 70;
export const LISTING_SEO_DESCRIPTION_MAX = 160;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function generateListingSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LISTING_SLUG_MAX);
}

export function isValidListingSlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= LISTING_SLUG_MAX &&
    SLUG_PATTERN.test(slug)
  );
}
