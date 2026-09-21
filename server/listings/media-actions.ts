"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { getListingById } from "@/server/listings/queries";
import {
  canAddListingMedia,
  listingMediaPath,
  neighborForMove,
  nextPrimaryIdAfterDelete,
  nextSortOrder,
  parseListingMediaAltText,
  shouldBecomePrimary,
  validateListingMediaFile,
} from "@/server/listings/media";
import {
  clearListingPrimary,
  deleteListingMediaFiles,
  deleteListingMediaRecord,
  getListingMediaById,
  insertListingMedia,
  listListingMedia,
  setListingMediaPrimary,
  updateListingMediaAlt,
  updateListingMediaPath,
  updateListingMediaSortOrder,
  uploadListingMediaFile,
} from "@/server/listings/media-queries";

export type ListingMediaFormState = {
  formError?: string;
} | null;

function editPath(listingId: string, status: string) {
  return `/dashboard/listings/${listingId}?status=${status}`;
}

async function requireListing(listingId: string) {
  if (!listingId) {
    return null;
  }

  return getListingById(listingId);
}

function readImageFile(formData: FormData, field = "image") {
  const value = formData.get(field);
  if (value == null || typeof value === "string") {
    return null;
  }

  const file = value as File;
  if (typeof file.size !== "number" || file.size === 0) {
    return null;
  }

  return file;
}

export async function uploadListingMedia(
  _previousState: ListingMediaFormState,
  formData: FormData,
): Promise<ListingMediaFormState> {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    return { formError: "That Listing could not be found." };
  }

  const file = readImageFile(formData);
  if (!file) {
    return { formError: "Choose an image to upload." };
  }

  const validated = await validateListingMediaFile(file);
  if ("error" in validated) {
    return { formError: validated.error };
  }

  const alt = parseListingMediaAltText(String(formData.get("alt_text") ?? ""));
  if ("error" in alt) {
    return { formError: alt.error };
  }

  const existing = await listListingMedia(listingId);
  if (!canAddListingMedia(existing.length)) {
    return { formError: "A Listing can have at most 12 images." };
  }

  const mediaId = crypto.randomUUID();
  const path = listingMediaPath(listingId, mediaId, validated.extension);
  const { error: uploadError } = await uploadListingMediaFile(
    path,
    file,
    validated.contentType,
  );

  if (uploadError) {
    console.error("Failed to upload listing media", { name: uploadError.name });
    return { formError: "The image could not be uploaded. Please try again." };
  }

  const { error } = await insertListingMedia({
    id: mediaId,
    listing_id: listingId,
    storage_path: path,
    alt_text: alt.alt_text,
    sort_order: nextSortOrder(existing),
    is_primary: shouldBecomePrimary(existing.length),
  });

  if (error) {
    console.error("Failed to save listing media", { code: error.code });
    await deleteListingMediaFiles([path]);
    return { formError: "The image could not be saved. Please try again." };
  }

  redirect(editPath(listingId, "media-added"));
}

export async function updateListingMediaAltText(formData: FormData) {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    redirect("/dashboard/listings");
  }

  const media = await getListingMediaById(mediaId);
  if (!media || media.listing_id !== listingId) {
    redirect(editPath(listingId, "media-failed"));
  }

  const alt = parseListingMediaAltText(String(formData.get("alt_text") ?? ""));
  if ("error" in alt) {
    redirect(editPath(listingId, "media-failed"));
  }

  const { error } = await updateListingMediaAlt(mediaId, listingId, alt.alt_text);
  if (error) {
    console.error("Failed to update listing media alt", { code: error.code });
    redirect(editPath(listingId, "media-failed"));
  }

  redirect(editPath(listingId, "media-updated"));
}

export async function replaceListingMedia(formData: FormData) {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    redirect("/dashboard/listings");
  }

  const media = await getListingMediaById(mediaId);
  if (!media || media.listing_id !== listingId) {
    redirect(editPath(listingId, "media-failed"));
  }

  const file = readImageFile(formData);
  if (!file) {
    redirect(editPath(listingId, "media-failed"));
  }

  const validated = await validateListingMediaFile(file);
  if ("error" in validated) {
    redirect(editPath(listingId, "media-failed"));
  }

  const path = listingMediaPath(
    listingId,
    `${mediaId}-${Date.now()}`,
    validated.extension,
  );
  const { error: uploadError } = await uploadListingMediaFile(
    path,
    file,
    validated.contentType,
  );

  if (uploadError) {
    console.error("Failed to replace listing media", { name: uploadError.name });
    redirect(editPath(listingId, "media-failed"));
  }

  const { error } = await updateListingMediaPath(mediaId, listingId, path);
  if (error) {
    console.error("Failed to save replaced listing media", { code: error.code });
    redirect(editPath(listingId, "media-failed"));
  }

  if (media.storage_path !== path) {
    await deleteListingMediaFiles([media.storage_path]);
  }

  redirect(editPath(listingId, "media-updated"));
}

export async function setPrimaryListingMedia(formData: FormData) {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    redirect("/dashboard/listings");
  }

  const media = await getListingMediaById(mediaId);
  if (!media || media.listing_id !== listingId) {
    redirect(editPath(listingId, "media-failed"));
  }

  const { error: clearError } = await clearListingPrimary(listingId);
  if (clearError) {
    console.error("Failed to clear listing primary media", {
      code: clearError.code,
    });
    redirect(editPath(listingId, "media-failed"));
  }

  const { error } = await setListingMediaPrimary(mediaId, listingId);
  if (error) {
    console.error("Failed to set listing primary media", { code: error.code });
    redirect(editPath(listingId, "media-failed"));
  }

  redirect(editPath(listingId, "media-updated"));
}

export async function moveListingMedia(formData: FormData) {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    redirect("/dashboard/listings");
  }

  if (direction !== "up" && direction !== "down") {
    redirect(editPath(listingId, "media-failed"));
  }

  const existing = await listListingMedia(listingId);
  const pair = neighborForMove(existing, mediaId, direction);
  if (!pair) {
    redirect(editPath(listingId, "media-updated"));
  }

  const { error: firstError } = await updateListingMediaSortOrder(
    pair.current.id,
    listingId,
    pair.neighbor.sort_order,
  );
  const { error: secondError } = await updateListingMediaSortOrder(
    pair.neighbor.id,
    listingId,
    pair.current.sort_order,
  );

  if (firstError || secondError) {
    console.error("Failed to reorder listing media", {
      code: firstError?.code ?? secondError?.code,
    });
    redirect(editPath(listingId, "media-failed"));
  }

  redirect(editPath(listingId, "media-updated"));
}

export async function deleteListingMedia(formData: FormData) {
  await requireOperator();

  const listingId = String(formData.get("listing_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const listing = await requireListing(listingId);
  if (!listing) {
    redirect("/dashboard/listings");
  }

  const existing = await listListingMedia(listingId);
  const media = existing.find((item) => item.id === mediaId);
  if (!media) {
    redirect(editPath(listingId, "media-failed"));
  }

  const nextPrimaryId = nextPrimaryIdAfterDelete(existing, mediaId);

  const { error } = await deleteListingMediaRecord(mediaId, listingId);
  if (error) {
    console.error("Failed to delete listing media", { code: error.code });
    redirect(editPath(listingId, "media-failed"));
  }

  if (nextPrimaryId && media.is_primary) {
    const { error: primaryError } = await setListingMediaPrimary(
      nextPrimaryId,
      listingId,
    );
    if (primaryError) {
      console.error("Failed to assign fallback primary image", {
        code: primaryError.code,
      });
    }
  }

  const { error: storageError } = await deleteListingMediaFiles([
    media.storage_path,
  ]);
  if (storageError) {
    console.error("Failed to remove listing media file", {
      name: storageError.name,
    });
  }

  redirect(editPath(listingId, "media-removed"));
}
