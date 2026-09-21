import { describe, expect, it } from "vitest";
import type { ListingMapMarker } from "@/server/listings/map-markers";
import type { PublicListingCard } from "@/server/listings/types";
import type { Enquiry, EnquiryDetail } from "@/server/enquiries/types";

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

describe("enquiry privacy", () => {
  it("does not put Enquiry personal data on public Listing cards", () => {
    expect(publicCard).not.toHaveProperty("enquiries");
    expect(publicCard).not.toHaveProperty("email");
    expect(publicCard).not.toHaveProperty("phone");
    expect(publicCard).not.toHaveProperty("message");
  });

  it("does not put Enquiry personal data on map markers", () => {
    expect(marker).not.toHaveProperty("enquiries");
    expect(marker).not.toHaveProperty("email");
    expect(marker).not.toHaveProperty("phone");
    expect(marker).not.toHaveProperty("message");
  });

  it("does not store entity_id on the Enquiry itself", () => {
    const enquiry: Enquiry = {
      id: "enquiry-1",
      listing_id: "listing-1",
      name: "Sam Taylor",
      email: "sam@example.com",
      phone: null,
      message: "Do you cover DY8 on weekday mornings?",
      status: "new",
      created_at: "2026-08-19T12:00:00.000Z",
      updated_at: "2026-08-19T12:00:00.000Z",
    };

    expect(enquiry).not.toHaveProperty("entity_id");
  });

  it("resolves Entity through the Listing on operator detail", () => {
    const detail: EnquiryDetail = {
      id: "enquiry-1",
      listing_id: "listing-1",
      name: "Sam Taylor",
      email: "sam@example.com",
      phone: null,
      message: "Do you cover DY8 on weekday mornings?",
      status: "new",
      created_at: "2026-08-19T12:00:00.000Z",
      updated_at: "2026-08-19T12:00:00.000Z",
      listing_title: "Sample Listing",
      listing_slug: "sample-listing",
      listing_status: "active",
      entity_name: "Sample Entity",
      entity_email: "provider@example.com",
      category_name: "Sample Category",
    };

    expect(detail.listing_id).toBe("listing-1");
    expect(detail.entity_name).toBe("Sample Entity");
    expect(detail.entity_email).toBe("provider@example.com");
    expect(detail).not.toHaveProperty("entity_id");
  });
});
