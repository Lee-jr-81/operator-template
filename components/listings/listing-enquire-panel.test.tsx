import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ListingEnquirePanel,
  hasListingEnquireContent,
} from "@/components/listings/listing-enquire-panel";
import type { ListingDetailsInput } from "@/lib/listings/vertical";

vi.mock("@/components/contact/listing-contact-area", () => ({
  ListingContactArea: () => (
    <h2>Interested in this listing?</h2>
  ),
}));

const emptyDetails: ListingDetailsInput = {
  service_format: "",
  price_text: "",
  duration_text: "",
};

const pricedDetails: ListingDetailsInput = {
  service_format: "Standard",
  price_text: "12",
  duration_text: "60 minutes",
};

const noContact = { whatsappUrl: null, canEnquire: false };

describe("ListingEnquirePanel", () => {
  it("shows price text as entered and keeps the contact heading", () => {
    render(
      <ListingEnquirePanel
        details={pricedDetails}
        currentDeal={{
          id: "deal-1",
          headline: "Introductory offer",
          description: "Book this week.",
          promo_code: null,
          starts_at: null,
          expires_at: "2026-12-31T00:00:00.000Z",
        }}
        listingId="listing-1"
        listingTitle="Sample Listing"
        entityName="Sample Entity"
        channels={{
          whatsappUrl: "https://wa.me/447700900123",
          canEnquire: false,
        }}
      />,
    );

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("60 minutes")).toBeInTheDocument();
    expect(screen.getByText("Introductory offer")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Interested in this listing?" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when there is no price, deal, or contact", () => {
    const { container } = render(
      <ListingEnquirePanel
        details={emptyDetails}
        currentDeal={null}
        listingId="listing-1"
        listingTitle="Sample Listing"
        entityName="Sample Entity"
        channels={noContact}
      />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      hasListingEnquireContent({
        details: emptyDetails,
        currentDeal: null,
        channels: noContact,
      }),
    ).toBe(false);
  });
});
