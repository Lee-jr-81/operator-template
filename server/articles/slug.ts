export const ARTICLE_TITLE_MAX = 120;
export const ARTICLE_SLUG_MAX = 80;
export const ARTICLE_EXCERPT_MAX = 280;
export const ARTICLE_BODY_MAX = 20000;
export const ARTICLE_SEO_TITLE_MAX = 70;
export const ARTICLE_SEO_DESCRIPTION_MAX = 160;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function generateArticleSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ARTICLE_SLUG_MAX);
}

export function isValidArticleSlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= ARTICLE_SLUG_MAX &&
    SLUG_PATTERN.test(slug)
  );
}
