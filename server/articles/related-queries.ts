import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ArticleRelatedListing } from "@/server/articles/types";
import { listPublicListingCardsByIds } from "@/server/listings/queries";
import { asListingStatus } from "@/server/listings/status";

function asName(
  value: { name: string } | { name: string }[] | null | undefined,
  fallback: string,
) {
  const row = Array.isArray(value) ? value[0] : value;
  return row?.name ?? fallback;
}

export async function listArticleRelatedListings(articleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_listings")
    .select(
      "listing_id, sort_order, listings(title, status, categories(name), entities(name))",
    )
    .eq("article_id", articleId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to list article listings", { code: error.code });
    throw new Error("Unable to load related Listings.");
  }

  return (data ?? []).map((row) => {
    const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings;
    const category = listing
      ? asName(
          listing.categories as { name: string } | { name: string }[] | null,
          "Unknown Category",
        )
      : "Unknown Category";
    const entity = listing
      ? asName(
          listing.entities as { name: string } | { name: string }[] | null,
          "Unknown Entity",
        )
      : "Unknown Entity";

    return {
      listing_id: row.listing_id,
      sort_order: row.sort_order,
      title: listing?.title ?? "Unknown Listing",
      entity_name: entity,
      category_name: category,
      status: asListingStatus(String(listing?.status ?? "inactive")),
    } satisfies ArticleRelatedListing;
  });
}

export async function listArticleListingSortRows(articleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_listings")
    .select("listing_id, sort_order")
    .eq("article_id", articleId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to list article listing order", { code: error.code });
    throw new Error("Unable to load related Listings.");
  }

  return data ?? [];
}

export async function insertArticleListing(input: {
  article_id: string;
  listing_id: string;
  sort_order: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("article_listings").insert(input);
  return { error };
}

export async function deleteArticleListing(
  articleId: string,
  listingId: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("article_listings")
    .delete()
    .eq("article_id", articleId)
    .eq("listing_id", listingId);

  return { error };
}

export async function updateArticleListingSortOrder(
  articleId: string,
  listingId: string,
  sortOrder: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("article_listings")
    .update({ sort_order: sortOrder })
    .eq("article_id", articleId)
    .eq("listing_id", listingId);

  return { error };
}

export async function listPublicRelatedListingCards(articleId: string) {
  const relations = await listArticleListingSortRows(articleId);
  return listPublicListingCardsByIds(relations.map((row) => row.listing_id));
}
