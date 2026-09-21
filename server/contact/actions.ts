"use server";

import { recordWhatsAppClick as recordWhatsAppClickRecord } from "@/server/contact/queries";

export async function recordWhatsAppClick(listingId: string) {
  if (!listingId) {
    return;
  }

  try {
    await recordWhatsAppClickRecord(listingId);
  } catch {
    console.error("Failed to record WhatsApp click");
  }
}
