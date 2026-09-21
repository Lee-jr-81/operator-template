import { validateSafeImageFile } from "@/lib/uploads/image-type";

export const CATEGORY_MEDIA_BUCKET = "category-media";
export const CATEGORY_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const CATEGORY_IMAGE_REQUIRED_MESSAGE =
  "Choose an image for this Category.";
export const CATEGORY_IMAGE_SAVE_FAILED_MESSAGE =
  "The Category image could not be saved. Please try again.";

export function readCategoryImageFile(formData: FormData) {
  const value = formData.get("image");
  if (value == null || typeof value === "string") {
    return null;
  }

  const file = value as File;
  if (typeof file.size !== "number" || file.size === 0) {
    return null;
  }

  return file;
}

export async function validateCategoryImageFile(file: File) {
  return validateSafeImageFile(file, {
    maxBytes: CATEGORY_IMAGE_MAX_BYTES,
    emptyMessage: CATEGORY_IMAGE_REQUIRED_MESSAGE,
    sizeMessage: "Use an image smaller than 5MB.",
    typeMessage: "Use a JPEG, PNG, or WebP image.",
  });
}

export function categoryImagePath(
  categoryId: string,
  mediaId: string,
  extension: string,
) {
  return `${categoryId}/${mediaId}.${extension}`;
}
