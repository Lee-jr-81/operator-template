import "server-only";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_MEDIA_BUCKET } from "@/server/categories/image";

export async function uploadCategoryImageFile(
  path: string,
  file: File,
  contentType: string,
) {
  const supabase = await createClient();
  const body = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(CATEGORY_MEDIA_BUCKET)
    .upload(path, body, {
      contentType,
      upsert: true,
    });

  return { error };
}

export async function deleteCategoryImageFiles(paths: string[]) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) {
    return { error: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(CATEGORY_MEDIA_BUCKET)
    .remove(uniquePaths);

  return { error };
}
