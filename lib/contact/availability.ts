import { toWhatsAppUrl } from "@/lib/contact/whatsapp";

export type ListingContactChannels = {
  whatsappUrl: string | null;
  canEnquire: boolean;
};

export function listingContactChannels(input: {
  phone: string | null;
  hasEmail: boolean;
}): ListingContactChannels {
  return {
    whatsappUrl: toWhatsAppUrl(input.phone),
    canEnquire: input.hasEmail,
  };
}

export function hasAnyListingContact(channels: ListingContactChannels) {
  return Boolean(channels.whatsappUrl || channels.canEnquire);
}
