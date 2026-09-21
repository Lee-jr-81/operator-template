import "server-only";

import {
  getOperatorNotificationEmail,
  getPlatformName,
} from "@/lib/mail/config";
import {
  entityEnquiryEmail,
  operatorEnquiryEmail,
} from "@/lib/mail/enquiry-templates";
import { sendTransactionalEmail } from "@/lib/mail/send";
import { getPublicListingUrl, getPublicSiteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase/admin";

export type StoredEnquiryNotifyInput = {
  enquiryId: string;
  listingId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string | null;
  message: string;
};

type ListingMailContext = {
  listingTitle: string;
  listingSlug: string;
  entityName: string;
  entityEmail: string | null;
};

async function loadListingMailContext(
  listingId: string,
): Promise<ListingMailContext | null> {
  const admin = createAdminClient();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin
    .from("listings")
    .select("title, slug, entities(name, email)")
    .eq("id", listingId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load enquiry mail context", { code: error.code });
    return null;
  }

  if (!data) {
    return null;
  }

  const entity = data.entities as
    | { name: string; email: string | null }
    | { name: string; email: string | null }[]
    | null;
  const entityRow = Array.isArray(entity) ? entity[0] : entity;

  return {
    listingTitle: data.title,
    listingSlug: data.slug,
    entityName: entityRow?.name ?? "Unknown Entity",
    entityEmail: entityRow?.email?.trim() || null,
  };
}

export async function safeNotifyEnquiryStored(
  input: StoredEnquiryNotifyInput,
) {
  try {
    await notifyEnquiryStored(input);
  } catch {
    console.error("Enquiry notification failed after persist");
  }
}

async function notifyEnquiryStored(input: StoredEnquiryNotifyInput) {
  const context = await loadListingMailContext(input.listingId);
  const platformName = getPlatformName();
  const listingUrl = context
    ? getPublicListingUrl(context.listingSlug)
    : null;
  const siteUrl = getPublicSiteUrl();
  const dashboardUrl = siteUrl
    ? `${siteUrl}/dashboard/enquiries/${input.enquiryId}`
    : null;

  if (context?.entityEmail) {
    const entityMail = entityEnquiryEmail({
      platformName,
      listingTitle: context.listingTitle,
      listingUrl,
      visitorName: input.visitorName,
      visitorEmail: input.visitorEmail,
      visitorPhone: input.visitorPhone,
      message: input.message,
    });

    try {
      await sendTransactionalEmail({
        to: context.entityEmail,
        subject: entityMail.subject,
        text: entityMail.text,
      });
    } catch {
      console.error("Entity enquiry email failed after persist");
    }
  }

  const operatorEmail = getOperatorNotificationEmail();
  if (operatorEmail && context) {
    const operatorMail = operatorEnquiryEmail({
      platformName,
      entityName: context.entityName,
      listingTitle: context.listingTitle,
      dashboardUrl,
    });

    try {
      await sendTransactionalEmail({
        to: operatorEmail,
        subject: operatorMail.subject,
        text: operatorMail.text,
      });
    } catch {
      console.error("Operator enquiry notification failed after persist");
    }
  }
}
