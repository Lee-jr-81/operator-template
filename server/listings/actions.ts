"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { parseListingDetailsInput } from "@/lib/listings/vertical-validation";
import type { ListingDetailsFieldErrors } from "@/lib/listings/vertical";
import { getCategoryById } from "@/server/categories/queries";
import { getEntityById } from "@/server/entities/queries";
import {
  deleteListingRecord,
  getListingById,
  getListingBySlug,
  getListingDetails,
  insertListing,
  updateListingRecord,
  upsertListingDetails,
} from "@/server/listings/queries";
import { buildDuplicatedListing, listingSlugAttempt } from "@/server/listings/duplicate";
import { deleteListingMediaFiles, listListingMedia } from "@/server/listings/media-queries";
import type { ListingFieldErrors } from "@/server/listings/types";
import {
  DUPLICATE_SLUG_MESSAGE,
  LISTING_SAVE_FAILED_MESSAGE,
  hasListingFieldErrors,
  isRestrictDeleteError,
  isUniqueSlugError,
  listingRelationshipErrors,
  parseListingInput,
} from "@/server/listings/validation";

export type ListingFormState = {
  fieldErrors?: ListingFieldErrors & ListingDetailsFieldErrors;
  formError?: string;
} | null;

function readListingForm(formData: FormData) {
  return parseListingInput({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    category_id: String(formData.get("category_id") ?? ""),
    entity_id: String(formData.get("entity_id") ?? ""),
    status: String(formData.get("status") ?? ""),
    is_featured: String(formData.get("is_featured") ?? ""),
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
  });
}

function readDetailsForm(formData: FormData) {
  return parseListingDetailsInput({
    service_format: String(formData.get("service_format") ?? ""),
    price_text: String(formData.get("price_text") ?? ""),
    duration_text: String(formData.get("duration_text") ?? ""),
  });
}

async function verifyRelationships(categoryId: string, entityId: string) {
  const [category, entity] = await Promise.all([
    getCategoryById(categoryId),
    getEntityById(entityId),
  ]);

  return listingRelationshipErrors({
    categoryExists: Boolean(category),
    entityExists: Boolean(entity),
  });
}

export async function createListing(
  _previousState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  await requireOperator();

  const parsed = readListingForm(formData);
  const details = readDetailsForm(formData);

  if ("fieldErrors" in parsed && "fieldErrors" in details) {
    return {
      fieldErrors: { ...parsed.fieldErrors, ...details.fieldErrors },
    };
  }

  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  if ("fieldErrors" in details) {
    return { fieldErrors: details.fieldErrors };
  }

  const relationshipErrors = await verifyRelationships(
    parsed.data.category_id,
    parsed.data.entity_id,
  );

  if (hasListingFieldErrors(relationshipErrors)) {
    return { fieldErrors: relationshipErrors };
  }

  const { data, error } = await insertListing(parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error || !data) {
    console.error("Failed to create listing", { code: error?.code });
    return { formError: LISTING_SAVE_FAILED_MESSAGE };
  }

  const { error: detailsError } = await upsertListingDetails(
    data.id,
    details.data,
  );

  if (detailsError) {
    console.error("Failed to save listing details", { code: detailsError.code });
    await deleteListingRecord(data.id);
    return { formError: LISTING_SAVE_FAILED_MESSAGE };
  }

  redirect(`/dashboard/listings/${data.id}?status=created`);
}

export async function updateListing(
  _previousState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { formError: "That Listing could not be found." };
  }

  const parsed = readListingForm(formData);
  const details = readDetailsForm(formData);

  if ("fieldErrors" in parsed && "fieldErrors" in details) {
    return {
      fieldErrors: { ...parsed.fieldErrors, ...details.fieldErrors },
    };
  }

  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  if ("fieldErrors" in details) {
    return { fieldErrors: details.fieldErrors };
  }

  const existing = await getListingById(id);
  if (!existing) {
    return { formError: "That Listing could not be found." };
  }

  const relationshipErrors = await verifyRelationships(
    parsed.data.category_id,
    parsed.data.entity_id,
  );

  if (hasListingFieldErrors(relationshipErrors)) {
    return { fieldErrors: relationshipErrors };
  }

  const { data, error } = await updateListingRecord(id, parsed.data);

  if (isUniqueSlugError(error)) {
    return { fieldErrors: { slug: DUPLICATE_SLUG_MESSAGE } };
  }

  if (error) {
    console.error("Failed to update listing", { code: error.code });
    return { formError: LISTING_SAVE_FAILED_MESSAGE };
  }

  if (!data) {
    return { formError: "That Listing could not be found." };
  }

  const { error: detailsError } = await upsertListingDetails(id, details.data);

  if (detailsError) {
    console.error("Failed to save listing details", { code: detailsError.code });
    return { formError: LISTING_SAVE_FAILED_MESSAGE };
  }

  redirect("/dashboard/listings?status=updated");
}

export async function deleteListing(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/listings");
  }

  const existing = await getListingById(id);
  if (!existing) {
    redirect("/dashboard/listings");
  }

  const media = await listListingMedia(id);
  const { error } = await deleteListingRecord(id);

  if (isRestrictDeleteError(error)) {
    redirect("/dashboard/listings?status=has-enquiries");
  }

  if (error) {
    console.error("Failed to delete listing", { code: error.code });
    redirect("/dashboard/listings?status=delete-failed");
  }

  const { error: storageError } = await deleteListingMediaFiles(
    media.map((item) => item.storage_path),
  );
  if (storageError) {
    console.error("Failed to remove listing media files", {
      name: storageError.name,
    });
  }

  redirect("/dashboard/listings?status=deleted");
}

export async function duplicateListing(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/listings");
  }

  const source = await getListingById(id);
  if (!source) {
    redirect("/dashboard/listings");
  }

  const details = await getListingDetails(id);
  const draft = buildDuplicatedListing(source, details);
  let created = null;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const slug = listingSlugAttempt(draft.listing.slug, attempt);
    const taken = await getListingBySlug(slug);
    if (taken) {
      continue;
    }

    const { data, error } = await insertListing({
      ...draft.listing,
      slug,
    });

    if (isUniqueSlugError(error)) {
      continue;
    }

    if (error || !data) {
      console.error("Failed to duplicate listing", { code: error?.code });
      redirect(`/dashboard/listings/${id}?status=duplicate-failed`);
    }

    created = data;
    break;
  }

  if (!created) {
    redirect(`/dashboard/listings/${id}?status=duplicate-failed`);
  }

  const { error: detailsError } = await upsertListingDetails(
    created.id,
    draft.details,
  );

  if (detailsError) {
    console.error("Failed to copy listing details", { code: detailsError.code });
    await deleteListingRecord(created.id);
    redirect(`/dashboard/listings/${id}?status=duplicate-failed`);
  }

  redirect(`/dashboard/listings/${created.id}?status=duplicated`);
}
