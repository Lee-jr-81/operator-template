import type { Listing } from "@/server/listings/types";

export function listingPageMetadata(listing: Pick<
  Listing,
  "title" | "summary" | "seo_title" | "seo_description"
>) {
  return {
    title: listing.seo_title || listing.title,
    description: listing.seo_description || listing.summary,
  };
}
