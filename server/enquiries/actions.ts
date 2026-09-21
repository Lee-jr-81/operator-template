"use server";

import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { isEnquiryStatus } from "@/lib/enquiries/status";
import { getListingContactChannels } from "@/server/contact/queries";
import { getListingById } from "@/server/listings/queries";
import { safeNotifyEnquiryStored } from "@/server/enquiries/notify";
import {
  getEnquiryById,
  insertPublicEnquiry,
  updateEnquiryStatusRecord,
} from "@/server/enquiries/queries";
import type { EnquiryFieldErrors } from "@/server/enquiries/types";
import {
  ENQUIRY_LISTING_UNAVAILABLE_MESSAGE,
  ENQUIRY_SUBMIT_FAILED_MESSAGE,
  canAcceptPublicEnquiry,
  enquirySubmitSuccess,
  isHoneypotTriggered,
  parseEnquiryInput,
} from "@/server/enquiries/validation";

export type EnquiryFormState = {
  success?: boolean;
  fieldErrors?: EnquiryFieldErrors;
  formError?: string;
} | null;

export async function submitEnquiry(
  _previousState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  if (isHoneypotTriggered(String(formData.get("company") ?? ""))) {
    return enquirySubmitSuccess();
  }

  const parsed = parseEnquiryInput({
    listing_id: String(formData.get("listing_id") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const listing = await getListingById(parsed.data.listing_id);
  if (!canAcceptPublicEnquiry(listing)) {
    return { formError: ENQUIRY_LISTING_UNAVAILABLE_MESSAGE };
  }

  const channels = await getListingContactChannels(parsed.data.listing_id);
  if (!channels.canEnquire) {
    return { formError: ENQUIRY_LISTING_UNAVAILABLE_MESSAGE };
  }

  const { data: enquiryId, error } = await insertPublicEnquiry(parsed.data);

  if (error) {
    console.error("Failed to submit enquiry", { code: error.code });
    return { formError: ENQUIRY_SUBMIT_FAILED_MESSAGE };
  }

  if (enquiryId) {
    await safeNotifyEnquiryStored({
      enquiryId,
      listingId: parsed.data.listing_id,
      visitorName: parsed.data.name,
      visitorEmail: parsed.data.email,
      visitorPhone: parsed.data.phone,
      message: parsed.data.message,
    });
  }

  return enquirySubmitSuccess();
}

export async function updateEnquiryStatus(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !isEnquiryStatus(status)) {
    redirect("/dashboard/enquiries");
  }

  const existing = await getEnquiryById(id);
  if (!existing) {
    redirect("/dashboard/enquiries");
  }

  const { error } = await updateEnquiryStatusRecord(id, status);

  if (error) {
    console.error("Failed to update enquiry status", { code: error.code });
    redirect(`/dashboard/enquiries/${id}?status=update-failed`);
  }

  redirect(`/dashboard/enquiries/${id}?status=updated`);
}
