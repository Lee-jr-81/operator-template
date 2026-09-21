import "server-only";

import { getSupabasePublicEnv } from "@/lib/env";
import { homepageCategoriesFromActiveListings } from "@/lib/homepage/selection";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import { CATEGORY_MEDIA_BUCKET } from "@/server/categories/image";
import type { Category, CategoryInput } from "@/server/categories/types";

const CATEGORY_COLUMNS =
  "id, name, slug, description, image_path, created_at, updated_at" as const;

export function getCategoryImagePublicUrl(storagePath: string) {
  const { url } = getSupabasePublicEnv();
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${CATEGORY_MEDIA_BUCKET}/${storagePath}`;
}

export async function listCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to list categories", { code: error.code });
    throw new Error("Unable to load categories.");
  }

  return (data ?? []) as Category[];
}

export async function listPublicHomepageCategories(limit: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("categories(id, name, slug, description, image_path)")
    .eq("status", "active");

  if (error) {
    console.error("Failed to list homepage categories", { code: error.code });
    throw new Error("Unable to load categories.");
  }

  return homepageCategoriesFromActiveListings(data ?? [], limit).map(
    (category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_path
        ? getCategoryImagePublicUrl(category.image_path)
        : null,
    }),
  );
}

export async function getCategoryById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load category", { code: error.code });
    throw new Error("Unable to load that Category.");
  }

  return (data as Category | null) ?? null;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load category by slug", { code: error.code });
    throw new Error("Unable to load that Category.");
  }

  return (data as Category | null) ?? null;
}

export async function insertCategory(input: CategoryInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select(CATEGORY_COLUMNS)
    .single();

  return { data: (data as Category | null) ?? null, error };
}

export async function updateCategoryRecord(id: string, input: CategoryInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select(CATEGORY_COLUMNS)
    .maybeSingle();

  return { data: (data as Category | null) ?? null, error };
}

export async function updateCategoryImagePath(
  id: string,
  imagePath: string | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ image_path: imagePath })
    .eq("id", id);

  return { error };
}

export async function deleteCategoryRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  return { error };
}
