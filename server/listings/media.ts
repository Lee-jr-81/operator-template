import { validateSafeImageFile } from "@/lib/uploads/image-type";

export const LISTING_MEDIA_BUCKET = "listing-media";
export const LISTING_MEDIA_MAX_BYTES = 5 * 1024 * 1024;
export const LISTING_MEDIA_MAX_PER_LISTING = 12;
export const LISTING_MEDIA_ALT_MAX = 160;

export type ListingMedia = {
  id: string;
  listing_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type PublicListingImage = {
  url: string;
  alt: string;
  is_primary: boolean;
};

export async function validateListingMediaFile(file: File) {
  return validateSafeImageFile(file, {
    maxBytes: LISTING_MEDIA_MAX_BYTES,
    emptyMessage: "Choose an image to upload.",
    sizeMessage: "Use an image smaller than 5MB.",
    typeMessage: "Use a JPEG, PNG, or WebP image.",
  });
}

export function parseListingMediaAltText(raw: string) {
  const alt_text = raw.trim();

  if (alt_text.length > LISTING_MEDIA_ALT_MAX) {
    return { error: `Use ${LISTING_MEDIA_ALT_MAX} characters or fewer.` };
  }

  return { alt_text };
}

export function listingMediaPath(
  listingId: string,
  mediaId: string,
  extension: string,
) {
  return `${listingId}/${mediaId}.${extension}`;
}

export function nextSortOrder(
  items: Array<{ sort_order: number }>,
) {
  if (items.length === 0) {
    return 0;
  }

  return Math.max(...items.map((item) => item.sort_order)) + 1;
}

export function shouldBecomePrimary(existingCount: number) {
  return existingCount === 0;
}

export function canAddListingMedia(existingCount: number) {
  return existingCount < LISTING_MEDIA_MAX_PER_LISTING;
}

export function nextPrimaryIdAfterDelete(
  items: Array<{ id: string; is_primary: boolean; sort_order: number }>,
  deletedId: string,
) {
  const remaining = items
    .filter((item) => item.id !== deletedId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));

  if (remaining.length === 0) {
    return null;
  }

  const deleted = items.find((item) => item.id === deletedId);
  if (!deleted?.is_primary) {
    return remaining.find((item) => item.is_primary)?.id ?? remaining[0].id;
  }

  return remaining[0].id;
}

export function neighborForMove(
  items: Array<{ id: string; sort_order: number }>,
  mediaId: string,
  direction: "up" | "down",
) {
  const sorted = [...items].sort(
    (a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id),
  );
  const index = sorted.findIndex((item) => item.id === mediaId);
  if (index < 0) {
    return null;
  }

  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  const current = sorted[index];
  const neighbor = sorted[neighborIndex];
  if (!current || !neighbor) {
    return null;
  }

  return { current, neighbor };
}

export function galleryHeroAndRest<T extends { is_primary: boolean }>(items: T[]) {
  const hero = items.find((item) => item.is_primary) ?? items[0] ?? null;
  const rest = items.filter((item) => item !== hero);
  return { hero, rest };
}
