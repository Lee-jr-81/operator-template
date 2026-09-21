import { isPubliclyVisibleArticle } from "@/lib/articles/status";
import { isPubliclyVisibleListing } from "@/server/listings/status";
import type { Category } from "@/server/categories/types";

export const PUBLIC_ARTICLE_CARD_COLUMNS =
  "id, title, slug, excerpt, hero_image_path, status, published_at" as const;

export function isPublicFeaturedListing(listing: {
  status: string;
  is_featured: boolean;
}) {
  return listing.is_featured && isPubliclyVisibleListing(listing.status);
}

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
};

export function homepageCategoriesFromActiveListings(
  rows: Array<{ categories: CategoryRow | CategoryRow[] | null }>,
  limit: number,
) {
  const byId = new Map<string, CategoryRow>();

  for (const row of rows) {
    const category = Array.isArray(row.categories)
      ? row.categories[0]
      : row.categories;
    if (!category) {
      continue;
    }
    byId.set(category.id, category);
  }

  return [...byId.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit) as Pick<
    Category,
    "id" | "name" | "slug" | "description" | "image_path"
  >[];
}

export function selectFeaturedPublicListings<
  T extends { status: string; is_featured: boolean; created_at: string },
>(listings: T[], limit: number) {
  return listings
    .filter(isPublicFeaturedListing)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, limit);
}

export function selectRecentlyAddedPublicListings<
  T extends { status: string; created_at: string },
>(listings: T[], limit: number) {
  return listings
    .filter((listing) => isPubliclyVisibleListing(listing.status))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, limit);
}

export function selectLatestPublicArticles<
  T extends { status: string; published_at: string | null },
>(articles: T[], limit: number, now = new Date()) {
  return articles
    .filter((article) => isPubliclyVisibleArticle(article, now))
    .sort(
      (a, b) =>
        Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? ""),
    )
    .slice(0, limit);
}
