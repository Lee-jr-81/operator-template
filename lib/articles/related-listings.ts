import { isPubliclyVisibleListing } from "@/server/listings/status";

export function nextRelatedListingSortOrder(
  items: Array<{ sort_order: number }>,
) {
  if (items.length === 0) {
    return 0;
  }

  return Math.max(...items.map((item) => item.sort_order)) + 1;
}

export function neighborForRelatedListingMove(
  items: Array<{ listing_id: string; sort_order: number }>,
  listingId: string,
  direction: "up" | "down",
) {
  const sorted = [...items].sort(
    (a, b) =>
      a.sort_order - b.sort_order || a.listing_id.localeCompare(b.listing_id),
  );
  const index = sorted.findIndex((item) => item.listing_id === listingId);
  if (index < 0) {
    return null;
  }

  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  const current = sorted[index];
  const neighbor = sorted[neighborIndex];
  if (!current || !neighbor) {
    return null;
  }

  return { current, neighbor };
}

export function publicRelatedListingIds(
  relations: Array<{ listing_id: string; sort_order: number }>,
  listings: Array<{ id: string; status: string }>,
) {
  const publicIds = new Set(
    listings
      .filter((listing) => isPubliclyVisibleListing(listing.status))
      .map((listing) => listing.id),
  );

  return [...relations]
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order || a.listing_id.localeCompare(b.listing_id),
    )
    .filter((relation) => publicIds.has(relation.listing_id))
    .map((relation) => relation.listing_id);
}

export function listingMatchesRelatedSearch(
  listing: { title: string; entity_name: string; category_name: string },
  query: string,
) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack =
    `${listing.title} ${listing.entity_name} ${listing.category_name}`.toLowerCase();
  return haystack.includes(needle);
}

export function isDuplicateArticleListingError(error: { code?: string } | null) {
  return error?.code === "23505";
}
