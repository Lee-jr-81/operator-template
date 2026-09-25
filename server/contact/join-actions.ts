"use server";

import { getOperatorNotificationEmail, getPlatformName } from "@/lib/mail/config";
import { sendTransactionalEmail } from "@/lib/mail/send";
import { TERMINOLOGY } from "@/config/terminology";
import { isHoneypotTriggered } from "@/server/enquiries/validation";
import {
  JOIN_SUBMIT_FAILED_MESSAGE,
  parseJoinInput,
  type JoinFieldErrors,
} from "@/server/contact/join-validation";

export type JoinFormState = {
  success?: boolean;
  fieldErrors?: JoinFieldErrors;
  formError?: string;
} | null;

export async function submitJoinRequest(
  _previousState: JoinFormState,
  formData: FormData,
): Promise<JoinFormState> {
  if (isHoneypotTriggered(String(formData.get("company") ?? ""))) {
    return { success: true };
  }

  const parsed = parseJoinInput({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const to = getOperatorNotificationEmail();
  if (!to) {
    console.error("Join request was not sent because no operator email is set");
    return { formError: JOIN_SUBMIT_FAILED_MESSAGE };
  }

  const { name, email, phone, message } = parsed.data;
  const entity = TERMINOLOGY.entity.singular.toLowerCase();
  const listings = TERMINOLOGY.listing.plural.toLowerCase();
  const platform = getPlatformName();
  const result = await sendTransactionalEmail({
    to,
    subject: `A ${entity} would like to join ${platform}`,
    text: [
      `${name} would like to list ${listings} on ${platform}.`,
      "",
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  if (!result.sent) {
    console.error("Failed to send join request", { reason: result.reason });
    return { formError: JOIN_SUBMIT_FAILED_MESSAGE };
  }

  return { success: true };
}
