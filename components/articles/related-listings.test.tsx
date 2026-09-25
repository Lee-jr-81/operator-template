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
      <RelatedListings listings={[]} heading="Latest Walking listings" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a compact list and a category link", () => {
    render(
      <RelatedListings
        listings={[listing]}
        heading="Latest Walking listings"
        categoryHref="/categories/walking"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Latest Walking listings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sample Listing" }),
    ).toHaveAttribute("href", "/listings/sample-listing");
    expect(screen.getByText("Standard · 60 minutes · From 12")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View the category" })).toHaveAttribute(
      "href",
      "/categories/walking",
    );
    expect(screen.getByRole("complementary")).not.toHaveClass("sticky");
  });
});
