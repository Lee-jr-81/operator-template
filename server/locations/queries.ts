import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import type { Location, LocationInput } from "@/server/locations/types";

const LOCATION_COLUMNS =
  "id, label, address_line_1, address_line_2, town_city, county_region, postcode, country, latitude, longitude, created_at, updated_at" as const;

export async function getLocationById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select(LOCATION_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load location", { code: error.code });
    throw new Error("Unable to load that location.");
  }

  return (data as Location | null) ?? null;
}

export async function insertLocation(input: LocationInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .insert(input)
    .select(LOCATION_COLUMNS)
    .single();

  return { data: (data as Location | null) ?? null, error };
}

export async function updateLocationRecord(id: string, input: LocationInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .update(input)
    .eq("id", id)
    .select(LOCATION_COLUMNS)
    .maybeSingle();

  return { data: (data as Location | null) ?? null, error };
}

export async function deleteLocationRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);

  return { error };
}

export async function deleteLocationIfUnused(locationId: string) {
  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from("entities")
    .select("id", { count: "exact", head: true })
    .eq("location_id", locationId);

  if (countError) {
    console.error("Failed to check location usage", { code: countError.code });
    return { error: countError };
  }

  if ((count ?? 0) > 0) {
    return { error: null };
  }

  return deleteLocationRecord(locationId);
}
