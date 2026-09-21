import { validateSafeImageFile } from "@/lib/uploads/image-type";

export const ENTITY_LOGO_BUCKET = "entity-logos";
export const ENTITY_LOGO_MAX_BYTES = 2 * 1024 * 1024;

export async function validateEntityLogo(file: File) {
  return validateSafeImageFile(file, {
    maxBytes: ENTITY_LOGO_MAX_BYTES,
    emptyMessage: "Choose a logo image to upload.",
    sizeMessage: "Use a logo smaller than 2MB.",
    typeMessage: "Use a JPEG, PNG, or WebP image for the logo.",
  });
}

export function entityLogoPath(entityId: string, extension: string) {
  return `${entityId}/logo.${extension}`;
}
