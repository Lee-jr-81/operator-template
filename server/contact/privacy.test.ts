import { describe, expect, it } from "vitest";
import { enquirySubmitSuccess } from "@/server/enquiries/validation";
import type { PublicListingCard } from "@/server/listings/types";
import type { ListingMapMarker } from "@/server/listings/map-markers";

const publicCard: PublicListingCard = {
  id: "listing-1",
  title: "Sample Listing",
  slug: "sample-listing",
  summary: "A short public summary of this listing.",
  category_name: "Sample Category",
  category_slug: "sample-category",
  entity_name: "Sample Entity",
  details: {
    service_format: "Standard",
    price_text: "From 18",
    duration_text: "60 minutes",
  },
  image: null,
  entity_location: "Example Town, Example County",
  created_at: "2026-08-16T12:00:00.000Z",
  current_deal: null,
};

const marker: ListingMapMarker = {
  listingId: "listing-1",
  slug: "sample-listing",
  title: "Sample Listing",
  entityName: "Sample Entity",
  locationLabel: "Example Town, Example County",
  latitude: 52.45,
  longitude: -2.14,
};

type WhatsAppClick = {
  id: string;
  listing_id: string;
  created_at: string;
};

describe("WhatsApp click privacy", () => {
  it("stores only Listing id and a timestamp", () => {
    const click: WhatsAppClick = {
      id: "click-1",
      listing_id: "listing-1",
      created_at: "2026-08-20T12:00:00.000Z",
    };

    expect(Object.keys(click).sort()).toEqual([
      "created_at",
      "id",
      "listing_id",
    ]);
    expect(click).not.toHaveProperty("visitor_id");
    expect(click).not.toHaveProperty("ip");
    expect(click).not.toHaveProperty("user_agent");
    expect(click).not.toHaveProperty("url");
  });

  it("does not put WhatsApp clicks on public Listing cards or map markers", () => {
    expect(publicCard).not.toHaveProperty("whatsapp_clicks");
    expect(publicCard).not.toHaveProperty("whatsappUrl");
    expect(marker).not.toHaveProperty("whatsapp_clicks");
    expect(marker).not.toHaveProperty("whatsappUrl");
  });
});

describe("enquiry visitor success", () => {
  it("does not expose mail delivery or the stored Enquiry id", () => {
    const result = enquirySubmitSuccess();

    expect(result).toEqual({ success: true });
    expect(result).not.toHaveProperty("mail");
    expect(result).not.toHaveProperty("enquiryId");
    expect(result).not.toHaveProperty("sent");
  });
});
