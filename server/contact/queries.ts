import "server-only";

import { listingContactChannels } from "@/lib/contact/availability";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";

export async function getListingContactChannels(listingId: string) {
  if (!isUuid(listingId)) {
    return listingContactChannels({ phone: null, hasEmail: false });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_listing_contact_channels", {
    p_listing_id: listingId,
  });

  if (error) {
    console.error("Failed to load listing contact channels", {
      code: error.code,
    });
    return listingContactChannels({ phone: null, hasEmail: false });
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    return listingContactChannels({ phone: null, hasEmail: false });
  }

  const channels = row as { phone?: unknown; has_email?: unknown };

  return listingContactChannels({
    phone: typeof channels.phone === "string" ? channels.phone : null,
    hasEmail: Boolean(channels.has_email),
  });
}

export async function countWhatsAppClicks() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("whatsapp_clicks")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Failed to count WhatsApp clicks", { code: error.code });
    throw new Error("Unable to load WhatsApp activity.");
  }

  return count ?? 0;
}

export async function recordWhatsAppClick(listingId: string) {
  if (!isUuid(listingId)) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("record_whatsapp_click", {
    p_listing_id: listingId,
  });

  if (error) {
    console.error("Failed to record WhatsApp click", { code: error.code });
  }
}
