import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelatedListings } from "@/components/articles/related-listings";
import type { PublicListingCard } from "@/server/listings/types";

const listing: PublicListingCard = {
  id: "listing-1",
  title: "Sample Listing",
  slug: "sample-listing",
  summary: "Walks in a small group.",
  category_name: "Sample Category",
  category_slug: "walking",
  entity_name: "Sample Entity",
  details: {
    service_format: "Standard",
    price_text: "From 12",
    duration_text: "60 minutes",
  },
  image: null,
  entity_location: "Example Town",
  created_at: "2026-08-26T12:00:00.000Z",
  current_deal: null,
};

describe("RelatedListings", () => {
  it("renders nothing when there are no cards to show", () => {
    const { container } = render(
      <RelatedListings listings={[]} heading="Related Listings" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the supplied heading when cards exist", () => {
    render(
      <RelatedListings listings={[listing]} heading="Related Listings" />,
    );

    expect(
      screen.getByRole("heading", { name: "Related Listings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Related Listings" })).toHaveClass(
      "bg-(--public-muted)",
    );
    expect(
      screen.getByRole("link", { name: "Sample Listing" }),
    ).toHaveAttribute("href", "/listings/sample-listing");
  });
});
