"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { getListingById } from "@/server/listings/queries";
import {
  deleteDealRecord,
  getDealById,
  insertDeal,
  listActiveDealsForListing,
  updateDealRecord,
} from "@/server/deals/queries";
import type { DealFieldErrors } from "@/server/deals/types";
import {
  DEAL_SAVE_FAILED_MESSAGE,
  overlappingActiveDealError,
  parseDealInput,
} from "@/server/deals/validation";

export type DealFormState = {
  fieldErrors?: DealFieldErrors;
  formError?: string;
} | null;

function readDealForm(
  formData: FormData,
  options: { requireFutureExpiry: boolean },
) {
  return parseDealInput(
    {
      listing_id: String(formData.get("listing_id") ?? ""),
      headline: String(formData.get("headline") ?? ""),
      description: String(formData.get("description") ?? ""),
      promo_code: String(formData.get("promo_code") ?? ""),
      starts_at: String(formData.get("starts_at") ?? ""),
      expires_at: String(formData.get("expires_at") ?? ""),
      is_active: String(formData.get("is_active") ?? ""),
    },
    options,
  );
}

async function listingAndOverlapErrors(
  input: {
    listing_id: string;
    is_active: boolean;
    starts_at: string | null;
    expires_at: string;
  },
  excludeId?: string,
): Promise<DealFieldErrors> {
  const listing = await getListingById(input.listing_id);
  const fieldErrors: DealFieldErrors = {};

  if (!listing) {
    fieldErrors.listing_id = "Choose a valid Listing.";
    return fieldErrors;
  }

  const existing = await listActiveDealsForListing(input.listing_id);
  const overlap = overlappingActiveDealError(input, existing, excludeId);
  if (overlap) {
    fieldErrors.listing_id = overlap;
  }

  return fieldErrors;
}

export async function createDeal(
  _previousState: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  await requireOperator();

  const parsed = readDealForm(formData, { requireFutureExpiry: true });
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const relationshipErrors = await listingAndOverlapErrors(parsed.data);
  if (relationshipErrors.listing_id) {
    return { fieldErrors: relationshipErrors };
  }

  const { data, error } = await insertDeal(parsed.data);

  if (error || !data) {
    console.error("Failed to create deal", { code: error?.code });
    return { formError: DEAL_SAVE_FAILED_MESSAGE };
  }

  redirect(`/dashboard/deals/${data.id}?status=created`);
}

export async function updateDeal(
  _previousState: DealFormState,
  formData: FormData,
): Promise<DealFormState> {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { formError: "That Deal could not be found." };
  }

  const existing = await getDealById(id);
  if (!existing) {
    return { formError: "That Deal could not be found." };
  }

  const parsed = readDealForm(formData, { requireFutureExpiry: false });
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const relationshipErrors = await listingAndOverlapErrors(parsed.data, id);
  if (relationshipErrors.listing_id) {
    return { fieldErrors: relationshipErrors };
  }

  const { data, error } = await updateDealRecord(id, parsed.data);

  if (error || !data) {
    console.error("Failed to update deal", { code: error?.code });
    return { formError: DEAL_SAVE_FAILED_MESSAGE };
  }

  redirect("/dashboard/deals?status=updated");
}

export async function deleteDeal(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/dashboard/deals");
  }

  const existing = await getDealById(id);
  if (!existing) {
    redirect("/dashboard/deals");
  }

  const { error } = await deleteDealRecord(id);

  if (error) {
    console.error("Failed to delete deal", { code: error.code });
    redirect("/dashboard/deals?status=delete-failed");
  }

  redirect("/dashboard/deals?status=deleted");
}
