import { TERMINOLOGY } from "@/config/terminology";
import type { PublicListingCard } from "@/server/listings/types";

export const ARTICLE_LISTING_BAND_MIN = 3;

export function relatedArticleBandHeading() {
  return "Related Listings";
}

export function latestArticleBandHeading() {
  return `Latest available ${TERMINOLOGY.listing.plural.toLowerCase()}`;
}

export function buildArticleListingBand(
  related: PublicListingCard[],
  latest: PublicListingCard[],
) {
  const fillNeeded = Math.max(0, ARTICLE_LISTING_BAND_MIN - related.length);
  const relatedIds = new Set(related.map((item) => item.id));
  const fill = latest
    .filter((item) => !relatedIds.has(item.id))
    .slice(0, fillNeeded);
  const listings = [...related, ...fill];

  if (listings.length === 0) {
    return null;
  }

  return {
    listings,
    heading:
      related.length > 0
        ? relatedArticleBandHeading()
        : latestArticleBandHeading(),
  };
}
