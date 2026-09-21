import "server-only";

import { selectCurrentDeal } from "@/lib/deals/current";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import type {
  Deal,
  DealInput,
  DealListItem,
  DealListingOption,
  PublicDeal,
} from "@/server/deals/types";
import { toPublicDeal } from "@/server/deals/validation";

const DEAL_COLUMNS =
  "id, listing_id, headline, description, promo_code, starts_at, expires_at, is_active, created_at, updated_at" as const;

function relationName(
  value: { name: string } | { name: string }[] | null | undefined,
) {
  if (Array.isArray(value)) {
    return value[0]?.name;
  }

  return value?.name;
}

export async function listOperatorDeals() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select(
      `${DEAL_COLUMNS}, listings(title, entities(name))`,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list deals", { code: error.code });
    throw new Error("Unable to load Deals.");
  }

  return (data ?? []).map((row) => {
    const listing = row.listings as
      | { title: string; entities: { name: string } | { name: string }[] | null }
      | {
          title: string;
          entities: { name: string } | { name: string }[] | null;
        }[]
      | null;
    const listingRow = Array.isArray(listing) ? listing[0] : listing;

    return {
      id: row.id,
      listing_id: row.listing_id,
      headline: row.headline,
      description: row.description,
      promo_code: row.promo_code,
      starts_at: row.starts_at,
      expires_at: row.expires_at,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      listing_title: listingRow?.title ?? "Unknown Listing",
      entity_name: relationName(listingRow?.entities) ?? "Unknown Entity",
    } as DealListItem;
  });
}

export async function listDealListingOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, status, categories(name), entities(name)")
    .order("title", { ascending: true });

  if (error) {
    console.error("Failed to list listings for deals", { code: error.code });
    throw new Error("Unable to load Listings.");
  }

  return (data ?? []).map((row) => {
    const category = row.categories as { name: string } | { name: string }[] | null;
    const entity = row.entities as { name: string } | { name: string }[] | null;

    return {
      id: row.id,
      title: row.title,
      status: row.status,
      category_name: relationName(category) ?? "Unknown Category",
      entity_name: relationName(entity) ?? "Unknown Entity",
    } satisfies DealListingOption;
  });
}

export async function getDealById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select(DEAL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load deal", { code: error.code });
    throw new Error("Unable to load that Deal.");
  }

  return (data as Deal | null) ?? null;
}

export async function listActiveDealsForListing(listingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select(DEAL_COLUMNS)
    .eq("listing_id", listingId)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to list listing deals", { code: error.code });
    throw new Error("Unable to check existing Deals.");
  }

  return (data as Deal[] | null) ?? [];
}

export async function insertDeal(input: DealInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .insert(input)
    .select(DEAL_COLUMNS)
    .single();

  return { data: (data as Deal | null) ?? null, error };
}

export async function updateDealRecord(id: string, input: DealInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .update(input)
    .eq("id", id)
    .select(DEAL_COLUMNS)
    .maybeSingle();

  return { data: (data as Deal | null) ?? null, error };
}

export async function deleteDealRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("deals").delete().eq("id", id);

  return { error };
}

export async function getCurrentPublicDealsByListingIds(
  listingIds: string[],
  now: Date = new Date(),
) {
  const currentByListingId = new Map<string, PublicDeal>();
  const listingIdsSafe = listingIds.filter(isUuid);

  if (listingIdsSafe.length === 0) {
    return currentByListingId;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select(`${DEAL_COLUMNS}, listings!inner(status)`)
    .in("listing_id", listingIdsSafe)
    .eq("is_active", true)
    .eq("listings.status", "active")
    .gt("expires_at", now.toISOString());

  if (error) {
    console.error("Failed to load current deals", { code: error.code });
    throw new Error("Unable to load Deals.");
  }

  const grouped = new Map<string, Deal[]>();
  for (const row of (data as Deal[] | null) ?? []) {
    const list = grouped.get(row.listing_id) ?? [];
    list.push(row);
    grouped.set(row.listing_id, list);
  }

  for (const listingId of listingIdsSafe) {
    const current = selectCurrentDeal(grouped.get(listingId) ?? [], now);
    if (current) {
      currentByListingId.set(listingId, toPublicDeal(current));
    }
  }

  return currentByListingId;
}

export async function getDealPromotionContext(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deals")
    .select(
      `${DEAL_COLUMNS}, listings(title, slug, status, entities(name))`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load deal promotion data", { code: error.code });
    throw new Error("Unable to load that Deal.");
  }

  if (!data) {
    return null;
  }

  const listing = data.listings as
    | {
        title: string;
        slug: string;
        status: string;
        entities: { name: string } | { name: string }[] | null;
      }
    | {
        title: string;
        slug: string;
        status: string;
        entities: { name: string } | { name: string }[] | null;
      }[]
    | null;
  const listingRow = Array.isArray(listing) ? listing[0] : listing;

  if (!listingRow) {
    return null;
  }

  return {
    deal: {
      id: data.id,
      listing_id: data.listing_id,
      headline: data.headline,
      description: data.description,
      promo_code: data.promo_code,
      starts_at: data.starts_at,
      expires_at: data.expires_at,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } satisfies Deal,
    listingTitle: listingRow.title,
    listingSlug: listingRow.slug,
    listingStatus: listingRow.status,
    entityName: relationName(listingRow.entities) ?? "Unknown Entity",
  };
}
