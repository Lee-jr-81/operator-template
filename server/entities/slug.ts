export const ENTITY_NAME_MAX = 120;
export const ENTITY_SLUG_MAX = 80;
export const ENTITY_CONTACT_NAME_MAX = 80;
export const ENTITY_EMAIL_MAX = 254;
export const ENTITY_PHONE_MAX = 30;
export const ENTITY_WEBSITE_MAX = 200;
export const ENTITY_DESCRIPTION_MAX = 500;
export const ENTITY_NOTES_MAX = 2000;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function generateEntitySlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ENTITY_SLUG_MAX);
}

export function isValidEntitySlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= ENTITY_SLUG_MAX &&
    SLUG_PATTERN.test(slug)
  );
}
