import { TERMINOLOGY } from "@/config/terminology";

export const ARTICLE_CATEGORY_LISTING_LIMIT = 3;

export function articleCategoryListingHeading(categoryName: string) {
  return `Latest ${categoryName} ${TERMINOLOGY.listing.plural.toLowerCase()}`;
}
