import "server-only";

import { isUuid } from "@/lib/uuid";
import { createClient } from "@/lib/supabase/server";
import {
  getPublicEntitiesByIds,
  getPublicEntityById,
} from "@/server/entities/queries";
import type { ListingDetailsInput } from "@/lib/listings/vertical";
import type {
  Listing,
  ListingInput,
  ListingListItem,
  PublicListingCard,
} from "@/server/listings/types";
import type { PublicEntity } from "@/server/entities/types";
import type { Category } from "@/server/categories/types";
import {
  getListingMediaPublicUrl,
  listListingMedia,
  listPrimaryListingMedia,
} from "@/server/listings/media-queries";
import type { PublicListingImage } from "@/server/listings/media";
import { getCurrentPublicDealsByListingIds } from "@/server/deals/queries";
import { formatConciseLocation } from "@/server/locations/format";

const LISTING_COLUMNS =
  "id, title, slug, summary, description, category_id, entity_id, status, is_featured, seo_title, seo_description, created_at, updated_at" as const;

const PUBLIC_LISTING_CARD_COLUMNS =
  "id, title, slug, summary, entity_id, created_at, categories(name, slug), listing_details(service_format, price_text, duration_text)" as const;

const DETAILS_COLUMNS =
  "listing_id, service_format, price_text, duration_text" as const;

function emptyDetails(): ListingDetailsInput {
  return { service_format: "", price_text: "", duration_text: "" };
}

function asDetails(row: {
  service_format?: string | null;
  price_text?: string | null;
  duration_text?: string | null;
} | null): ListingDetailsInput {
  if (!row) {
    return emptyDetails();
  }

  return {
    service_format: row.service_format ?? "",
    price_text: row.price_text ?? "",
    duration_text: row.duration_text ?? "",
  };
}

export async function listOperatorListings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, title, slug, status, updated_at, categories(name), entities(name)",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return (data ?? []).map((row) => {
    const category = row.categories as { name: string } | { name: string }[] | null;
    const entity = row.entities as { name: string } | { name: string }[] | null;
    const categoryName = Array.isArray(category)
      ? category[0]?.name
      : category?.name;
    const entityName = Array.isArray(entity) ? entity[0]?.name : entity?.name;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      updated_at: row.updated_at,
      category_name: categoryName ?? "Unknown Category",
      entity_name: entityName ?? "Unknown Entity",
    } as ListingListItem;
  });
}

export async function countOperatorListings() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Failed to count listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return count ?? 0;
}

export async function getListingBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load listing by slug", { code: error.code });
    throw new Error("Unable to load that Listing.");
  }

  return (data as Listing | null) ?? null;
}

export async function getListingById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load listing", { code: error.code });
    throw new Error("Unable to load that Listing.");
  }

  return (data as Listing | null) ?? null;
}

export async function getListingDetails(listingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_details")
    .select(DETAILS_COLUMNS)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load listing details", { code: error.code });
    throw new Error("Unable to load Listing details.");
  }

  return asDetails(data);
}

export async function insertListing(input: ListingInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .insert(input)
    .select(LISTING_COLUMNS)
    .single();

  return { data: (data as Listing | null) ?? null, error };
}

export async function updateListingRecord(id: string, input: ListingInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .update(input)
    .eq("id", id)
    .select(LISTING_COLUMNS)
    .maybeSingle();

  return { data: (data as Listing | null) ?? null, error };
}

export async function upsertListingDetails(
  listingId: string,
  details: ListingDetailsInput,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("listing_details").upsert({
    listing_id: listingId,
    ...details,
  });

  return { error };
}

export async function deleteListingRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);

  return { error };
}

type PublicListingRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  entity_id: string;
  created_at: string;
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
  listing_details:
    | {
        service_format: string;
        price_text: string;
        duration_text: string;
      }
    | {
        service_format: string;
        price_text: string;
        duration_text: string;
      }[]
    | null;
};

async function mapPublicCards(rows: PublicListingRow[]): Promise<PublicListingCard[]> {
  const entities = await getPublicEntitiesByIds(rows.map((row) => row.entity_id));
  const primaryMedia = await listPrimaryListingMedia(rows.map((row) => row.id));
  const currentDeals = await getCurrentPublicDealsByListingIds(
    rows.map((row) => row.id),
  );

  return rows.map((row) => {
    const category = Array.isArray(row.categories)
      ? row.categories[0]
      : row.categories;
    const details = Array.isArray(row.listing_details)
      ? row.listing_details[0]
      : row.listing_details;
    const image = primaryMedia.get(row.id);
    const entity = entities.get(row.entity_id);
    const currentDeal = currentDeals.get(row.id);

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      category_name: category?.name ?? "Uncategorised",
      category_slug: category?.slug ?? "",
      entity_name: entity?.name ?? "Unknown provider",
      details: asDetails(details ?? null),
      image: image
        ? {
            url: getListingMediaPublicUrl(image.storage_path),
            alt: image.alt_text || row.title,
          }
        : null,
      entity_location: formatConciseLocation(entity?.location),
      created_at: row.created_at,
      current_deal: currentDeal
        ? {
            id: currentDeal.id,
            headline: currentDeal.headline,
          }
        : null,
    };
  });
}

export async function listPublicListings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list public listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return mapPublicCards(data ?? []);
}

export async function listPublicFeaturedListingCards(limit: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to list featured listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return mapPublicCards(data ?? []);
}

export async function listPublicRecentListingCards(limit: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to list recent listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return mapPublicCards(data ?? []);
}

export async function listPublicListingsByCategoryId(categoryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .eq("category_id", categoryId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list category listings", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return mapPublicCards(data ?? []);
}

export async function listPublicListingCardsByIds(listingIds: string[]) {
  const listingIdsSafe = listingIds.filter(isUuid);
  if (listingIdsSafe.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .in("id", listingIdsSafe);

  if (error) {
    console.error("Failed to list public listings by id", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  const cards = await mapPublicCards(data ?? []);
  const byId = new Map(cards.map((card) => [card.id, card]));

  return listingIdsSafe.flatMap((id) => {
    const card = byId.get(id);
    return card ? [card] : [];
  });
}

export async function getPublicListingBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `${LISTING_COLUMNS}, categories(id, name, slug, description, image_path, created_at, updated_at), listing_details(${DETAILS_COLUMNS})`,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("Failed to load public listing", { code: error.code });
    throw new Error("Unable to load that Listing.");
  }

  if (!data) {
    return null;
  }

  const listing = data as Listing & {
    categories: Category | Category[] | null;
    listing_details:
      | {
          service_format: string;
          price_text: string;
          duration_text: string;
        }
      | {
          service_format: string;
          price_text: string;
          duration_text: string;
        }[]
      | null;
  };

  const category = Array.isArray(listing.categories)
    ? listing.categories[0]
    : listing.categories;
  const details = Array.isArray(listing.listing_details)
    ? listing.listing_details[0]
    : listing.listing_details;
  const entity = await getPublicEntityById(listing.entity_id);
  const media = await listListingMedia(listing.id);

  if (!category || !entity) {
    return null;
  }

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      summary: listing.summary,
      description: listing.description,
      category_id: listing.category_id,
      entity_id: listing.entity_id,
      status: listing.status,
      is_featured: listing.is_featured,
      seo_title: listing.seo_title,
      seo_description: listing.seo_description,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
    } satisfies Listing,
    category,
    entity: entity as PublicEntity,
    details: asDetails(details ?? null),
    media: media.map(
      (item): PublicListingImage => ({
        url: getListingMediaPublicUrl(item.storage_path),
        alt: item.alt_text || listing.title,
        is_primary: item.is_primary,
      }),
    ),
  };
}
