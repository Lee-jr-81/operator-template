import "server-only";

import { getSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import { ENTITY_LOGO_BUCKET } from "@/server/entities/logo";
import type { Entity, EntityInput, PublicEntity } from "@/server/entities/types";
import { parseStoredCoordinate } from "@/server/locations/coordinates";
import type { PublicLocation } from "@/server/locations/types";

const ENTITY_COLUMNS =
  "id, name, slug, logo_path, contact_name, email, phone, website_url, show_email, show_phone, show_website, public_description, operator_notes, location_id, created_at, updated_at" as const;

const PUBLIC_ENTITY_COLUMNS =
  "id, name, slug, logo_path, public_description, email, phone, website_url, location_label, location_town_city, location_county_region, location_postcode, location_country, location_latitude, location_longitude" as const;

export function getEntityLogoPublicUrl(logoPath: string | null) {
  if (!logoPath) {
    return null;
  }

  const { url } = getSupabasePublicEnv();
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${ENTITY_LOGO_BUCKET}/${logoPath}`;
}

export async function listEntities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entities")
    .select(ENTITY_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to list entities", { code: error.code });
    throw new Error("Unable to load Entities.");
  }

  return (data ?? []) as Entity[];
}

export async function countEntities() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("entities")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Failed to count entities", { code: error.code });
    throw new Error("Unable to load Entities.");
  }

  return count ?? 0;
}

export async function getEntityById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entities")
    .select(ENTITY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load entity", { code: error.code });
    throw new Error("Unable to load that Entity.");
  }

  return (data as Entity | null) ?? null;
}

export async function insertEntity(input: EntityInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entities")
    .insert(input)
    .select(ENTITY_COLUMNS)
    .single();

  return { data: (data as Entity | null) ?? null, error };
}

export async function updateEntityRecord(id: string, input: EntityInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entities")
    .update(input)
    .eq("id", id)
    .select(ENTITY_COLUMNS)
    .maybeSingle();

  return { data: (data as Entity | null) ?? null, error };
}

export async function updateEntityLogoPath(id: string, logoPath: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entities")
    .update({ logo_path: logoPath })
    .eq("id", id);

  return { error };
}

export async function updateEntityLocationId(
  id: string,
  locationId: string | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entities")
    .update({ location_id: locationId })
    .eq("id", id);

  return { error };
}

export async function deleteEntityRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("entities").delete().eq("id", id);

  return { error };
}

function asPublicLocation(row: {
  location_label: string | null;
  location_town_city: string | null;
  location_county_region: string | null;
  location_postcode: string | null;
  location_country: string | null;
  location_latitude: unknown;
  location_longitude: unknown;
}): PublicLocation | null {
  const latitude = parseStoredCoordinate(row.location_latitude);
  const longitude = parseStoredCoordinate(row.location_longitude);

  if (
    row.location_label == null &&
    row.location_town_city == null &&
    row.location_county_region == null &&
    row.location_postcode == null &&
    row.location_country == null &&
    latitude == null &&
    longitude == null
  ) {
    return null;
  }

  return {
    label: row.location_label ?? "",
    town_city: row.location_town_city ?? "",
    county_region: row.location_county_region ?? "",
    postcode: row.location_postcode ?? "",
    country: row.location_country ?? "",
    latitude,
    longitude,
  };
}

function asPublicEntity(row: {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  public_description: string;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  location_label: string | null;
  location_town_city: string | null;
  location_county_region: string | null;
  location_postcode: string | null;
  location_country: string | null;
  location_latitude: unknown;
  location_longitude: unknown;
}): PublicEntity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo_path: row.logo_path,
    public_description: row.public_description,
    email: row.email,
    phone: row.phone,
    website_url: row.website_url,
    location: asPublicLocation(row),
  };
}

export async function getPublicEntityById(id: string): Promise<PublicEntity | null> {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entity_public")
    .select(PUBLIC_ENTITY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load public entity", { code: error.code });
    throw new Error("Unable to load that Entity.");
  }

  if (!data) {
    return null;
  }

  return asPublicEntity(data);
}

export async function getPublicEntitiesByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(isUuid))];
  const byId = new Map<string, PublicEntity>();

  if (uniqueIds.length === 0) {
    return byId;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entity_public")
    .select(PUBLIC_ENTITY_COLUMNS)
    .in("id", uniqueIds);

  if (error) {
    console.error("Failed to load public entities", { code: error.code });
    throw new Error("Unable to load Entities.");
  }

  for (const row of data ?? []) {
    byId.set(row.id, asPublicEntity(row));
  }

  return byId;
}

export async function uploadEntityLogo(path: string, file: File) {
  const supabase = await createClient();
  const body = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(ENTITY_LOGO_BUCKET)
    .upload(path, body, {
      contentType: file.type,
      upsert: true,
    });

  return { error };
}

export async function deleteEntityLogo(path: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(ENTITY_LOGO_BUCKET)
    .remove([path]);

  return { error };
}
