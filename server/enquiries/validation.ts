import type { EnquiryFieldErrors, EnquiryInput } from "@/server/enquiries/types";
import { isUuid } from "@/lib/uuid";

export const ENQUIRY_NAME_MAX = 80;
export const ENQUIRY_EMAIL_MAX = 254;
export const ENQUIRY_PHONE_MAX = 40;
export const ENQUIRY_PHONE_MIN = 6;
export const ENQUIRY_MESSAGE_MIN = 10;
export const ENQUIRY_MESSAGE_MAX = 2000;

export const ENQUIRY_SUBMIT_FAILED_MESSAGE =
  "The enquiry could not be sent. Please try again.";

export const ENQUIRY_LISTING_UNAVAILABLE_MESSAGE =
  "That Listing is not available for enquiry.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+0-9()\s.-]{6,40}$/;

export function hasEnquiryFieldErrors(fieldErrors: EnquiryFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

export function isHoneypotTriggered(value: string) {
  return value.trim().length > 0;
}

export function canAcceptPublicEnquiry(listing: {
  id: string;
  status: string;
} | null) {
  return Boolean(listing && listing.status === "active");
}

export function parseEnquiryInput(raw: {
  listing_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}): { data: EnquiryInput } | { fieldErrors: EnquiryFieldErrors } {
  const listingId = raw.listing_id.trim();
  const name = raw.name.trim();
  const email = raw.email.trim();
  const phone = raw.phone.trim();
  const message = raw.message.trim();
  const fieldErrors: EnquiryFieldErrors = {};

  if (!listingId || !isUuid(listingId)) {
    fieldErrors.listing_id = ENQUIRY_LISTING_UNAVAILABLE_MESSAGE;
  }

  if (!name) {
    fieldErrors.name = "Enter your name.";
  } else if (name.length > ENQUIRY_NAME_MAX) {
    fieldErrors.name = `Use ${ENQUIRY_NAME_MAX} characters or fewer.`;
  }

  if (!email) {
    fieldErrors.email = "Enter your email address.";
  } else if (email.length > ENQUIRY_EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (phone) {
    if (
      phone.length < ENQUIRY_PHONE_MIN ||
      phone.length > ENQUIRY_PHONE_MAX ||
      !PHONE_PATTERN.test(phone)
    ) {
      fieldErrors.phone =
        "Enter a phone number using digits and common symbols only.";
    }
  }

  if (!message) {
    fieldErrors.message = "Enter a message.";
  } else if (message.length < ENQUIRY_MESSAGE_MIN) {
    fieldErrors.message = `Use at least ${ENQUIRY_MESSAGE_MIN} characters.`;
  } else if (message.length > ENQUIRY_MESSAGE_MAX) {
    fieldErrors.message = `Use ${ENQUIRY_MESSAGE_MAX} characters or fewer.`;
  }

  if (hasEnquiryFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  return {
    data: {
      listing_id: listingId,
      name,
      email,
      phone: phone || null,
      message,
    },
  };
}

export function enquirySubmitSuccess() {
  return { success: true as const };
}
