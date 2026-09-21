export const MISSING_SITE_URL_MESSAGE =
  "Missing NEXT_PUBLIC_SITE_URL. Set it in .env.local to the public site origin, such as http://localhost:3000.";

export function getPublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return value || null;
}

export function getPublicListingUrl(slug: string) {
  const origin = getPublicSiteUrl();
  if (!origin) {
    return null;
  }

  return `${origin}/listings/${slug}`;
}

export function getPublicArticleUrl(slug: string) {
  const origin = getPublicSiteUrl();
  if (!origin) {
    return null;
  }

  return `${origin}/articles/${slug}`;
}
