import "server-only";

import { asEnquiryStatus, type EnquiryStatus } from "@/lib/enquiries/status";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/uuid";
import type {
  Enquiry,
  EnquiryDetail,
  EnquiryInput,
  EnquiryListItem,
} from "@/server/enquiries/types";

const ENQUIRY_COLUMNS =
  "id, listing_id, name, email, phone, message, status, created_at, updated_at" as const;

function relationName(
  value: { name: string } | { name: string }[] | null | undefined,
) {
  if (Array.isArray(value)) {
    return value[0]?.name;
  }

  return value?.name;
}

function relationEmail(
  value:
    | { name: string; email?: string | null }
    | { name: string; email?: string | null }[]
    | null
    | undefined,
) {
  const row = Array.isArray(value) ? value[0] : value;
  return row?.email?.trim() || null;
}

export async function insertPublicEnquiry(input: EnquiryInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_public_enquiry", {
    p_listing_id: input.listing_id,
    p_name: input.name,
    p_email: input.email,
    p_phone: input.phone ?? "",
    p_message: input.message,
  });

  return { data: typeof data === "string" ? data : null, error };
}

export async function listOperatorEnquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select(
      `${ENQUIRY_COLUMNS}, listings(title, slug, entities(name))`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list enquiries", { code: error.code });
    throw new Error("Unable to load Enquiries.");
  }

  return (data ?? []).map((row) => {
    const listing = row.listings as
      | {
          title: string;
          slug: string;
          entities: { name: string } | { name: string }[] | null;
        }
      | {
          title: string;
          slug: string;
          entities: { name: string } | { name: string }[] | null;
        }[]
      | null;
    const listingRow = Array.isArray(listing) ? listing[0] : listing;

    return {
      id: row.id,
      name: row.name,
      status: asEnquiryStatus(String(row.status)),
      created_at: row.created_at,
      listing_id: row.listing_id,
      listing_title: listingRow?.title ?? "Unknown Listing",
      listing_slug: listingRow?.slug ?? "",
      entity_name: relationName(listingRow?.entities) ?? "Unknown Entity",
    } as EnquiryListItem;
  });
}

export async function countNewEnquiries() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    console.error("Failed to count new enquiries", { code: error.code });
    throw new Error("Unable to load Enquiries.");
  }

  return count ?? 0;
}

export async function getEnquiryById(id: string) {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select(
      `${ENQUIRY_COLUMNS}, listings(title, slug, status, entities(name, email), categories(name))`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load enquiry", { code: error.code });
    throw new Error("Unable to load that Enquiry.");
  }

  if (!data) {
    return null;
  }

  const listing = data.listings as
    | {
        title: string;
        slug: string;
        status: string;
        entities:
          | { name: string; email: string | null }
          | { name: string; email: string | null }[]
          | null;
        categories: { name: string } | { name: string }[] | null;
      }
    | {
        title: string;
        slug: string;
        status: string;
        entities:
          | { name: string; email: string | null }
          | { name: string; email: string | null }[]
          | null;
        categories: { name: string } | { name: string }[] | null;
      }[]
    | null;
  const listingRow = Array.isArray(listing) ? listing[0] : listing;

  return {
    id: data.id,
    listing_id: data.listing_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    status: asEnquiryStatus(String(data.status)),
    created_at: data.created_at,
    updated_at: data.updated_at,
    listing_title: listingRow?.title ?? "Unknown Listing",
    listing_slug: listingRow?.slug ?? "",
    listing_status: listingRow?.status ?? "inactive",
    entity_name: relationName(listingRow?.entities) ?? "Unknown Entity",
    entity_email: relationEmail(listingRow?.entities),
    category_name: relationName(listingRow?.categories) ?? "Unknown Category",
  } satisfies EnquiryDetail;
}

export async function updateEnquiryStatusRecord(
  id: string,
  status: EnquiryStatus,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id)
    .select(ENQUIRY_COLUMNS)
    .maybeSingle();

  return { data: (data as Enquiry | null) ?? null, error };
}
