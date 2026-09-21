import "server-only";

import { getSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import {
  LISTING_MEDIA_BUCKET,
  type ListingMedia,
} from "@/server/listings/media";

const MEDIA_COLUMNS =
  "id, listing_id, storage_path, alt_text, sort_order, is_primary, created_at" as const;

export function getListingMediaPublicUrl(storagePath: string) {
  const { url } = getSupabasePublicEnv();
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${LISTING_MEDIA_BUCKET}/${storagePath}`;
}

export async function listListingMedia(listingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_media")
    .select(MEDIA_COLUMNS)
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to list listing media", { code: error.code });
    throw new Error("Unable to load Listing images.");
  }

  return (data ?? []) as ListingMedia[];
}

export async function getListingMediaById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_media")
    .select(MEDIA_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load listing media", { code: error.code });
    throw new Error("Unable to load that image.");
  }

  return (data as ListingMedia | null) ?? null;
}

export async function listPrimaryListingMedia(listingIds: string[]) {
  const uniqueIds = [...new Set(listingIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map<string, ListingMedia>();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_media")
    .select(MEDIA_COLUMNS)
    .in("listing_id", uniqueIds)
    .eq("is_primary", true);

  if (error) {
    console.error("Failed to load primary listing media", { code: error.code });
    throw new Error("Unable to load Listing images.");
  }

  const byListingId = new Map<string, ListingMedia>();
  for (const row of (data ?? []) as ListingMedia[]) {
    byListingId.set(row.listing_id, row);
  }

  return byListingId;
}

export async function insertListingMedia(row: {
  id: string;
  listing_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_media")
    .insert(row)
    .select(MEDIA_COLUMNS)
    .single();

  return { data: (data as ListingMedia | null) ?? null, error };
}

export async function updateListingMediaAlt(id: string, listingId: string, altText: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .update({ alt_text: altText })
    .eq("id", id)
    .eq("listing_id", listingId);

  return { error };
}

export async function updateListingMediaPath(id: string, listingId: string, storagePath: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .update({ storage_path: storagePath })
    .eq("id", id)
    .eq("listing_id", listingId);

  return { error };
}

export async function clearListingPrimary(listingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .update({ is_primary: false })
    .eq("listing_id", listingId)
    .eq("is_primary", true);

  return { error };
}

export async function setListingMediaPrimary(id: string, listingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .update({ is_primary: true })
    .eq("id", id)
    .eq("listing_id", listingId);

  return { error };
}

export async function updateListingMediaSortOrder(
  id: string,
  listingId: string,
  sortOrder: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .update({ sort_order: sortOrder })
    .eq("id", id)
    .eq("listing_id", listingId);

  return { error };
}

export async function deleteListingMediaRecord(id: string, listingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_media")
    .delete()
    .eq("id", id)
    .eq("listing_id", listingId);

  return { error };
}

export async function uploadListingMediaFile(
  path: string,
  file: File,
  contentType: string,
) {
  const supabase = await createClient();
  const body = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .upload(path, body, {
      contentType,
      upsert: true,
    });

  return { error };
}

export async function deleteListingMediaFiles(paths: string[]) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) {
    return { error: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .remove(uniquePaths);

  return { error };
}
