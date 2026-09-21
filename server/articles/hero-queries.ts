import "server-only";

import { createClient } from "@/lib/supabase/server";
import { ARTICLE_MEDIA_BUCKET } from "@/server/articles/hero";

export async function uploadArticleHeroFile(
  path: string,
  file: File,
  contentType: string,
) {
  const supabase = await createClient();
  const body = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(ARTICLE_MEDIA_BUCKET)
    .upload(path, body, {
      contentType,
      upsert: true,
    });

  return { error };
}

export async function deleteArticleHeroFiles(paths: string[]) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) {
    return { error: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(ARTICLE_MEDIA_BUCKET)
    .remove(uniquePaths);

  return { error };
}
