import "server-only";

import { Resend } from "resend";
import {
  getMailFrom,
  getResendApiKey,
  isMailConfigured,
} from "@/lib/mail/config";

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!isMailConfigured()) {
    return { sent: false as const, reason: "not-configured" as const };
  }

  const apiKey = getResendApiKey();
  const from = getMailFrom();
  if (!apiKey || !from) {
    return { sent: false as const, reason: "not-configured" as const };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });

    if (error) {
      console.error("Failed to send transactional email", {
        name: error.name,
      });
      return { sent: false as const, reason: "provider" as const };
    }
  } catch {
    console.error("Failed to send transactional email");
    return { sent: false as const, reason: "provider" as const };
  }

  return { sent: true as const };
}
