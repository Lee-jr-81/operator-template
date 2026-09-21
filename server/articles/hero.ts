import { validateSafeImageFile } from "@/lib/uploads/image-type";

export const ARTICLE_MEDIA_BUCKET = "article-media";
export const ARTICLE_HERO_MAX_BYTES = 5 * 1024 * 1024;

export async function validateArticleHeroFile(file: File) {
  return validateSafeImageFile(file, {
    maxBytes: ARTICLE_HERO_MAX_BYTES,
    emptyMessage: "Choose an image to upload.",
    sizeMessage: "Use an image smaller than 5MB.",
    typeMessage: "Use a JPEG, PNG, or WebP image.",
  });
}

export function articleHeroPath(
  articleId: string,
  mediaId: string,
  extension: string,
) {
  return `${articleId}/${mediaId}.${extension}`;
}
