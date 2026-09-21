import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RelatedListingsPanel } from "@/app/dashboard/articles/related-listings-panel";
import type { ArticleRelatedListing } from "@/server/articles/types";
import type { ListingListItem } from "@/server/listings/types";

vi.mock("@/server/articles/related-actions", () => ({
  addArticleListing: vi.fn(),
  removeArticleListing: vi.fn(),
  moveArticleListing: vi.fn(),
}));

const selected: ArticleRelatedListing[] = [
  {
    listing_id: "listing-1",
    sort_order: 0,
    title: "Sample Listing",
    entity_name: "Sample Entity",
    category_name: "Sample Category",
    status: "active",
  },
];

const listings: ListingListItem[] = [
  {
    id: "listing-1",
    title: "Sample Listing",
    slug: "sample-listing",
    status: "active",
    updated_at: "2026-08-21T00:00:00.000Z",
    category_name: "Sample Category",
    entity_name: "Sample Entity",
  },
  {
    id: "listing-2",
    title: "Second Sample Listing",
    slug: "second-sample-listing",
    status: "inactive",
    updated_at: "2026-08-21T00:00:00.000Z",
    category_name: "Sample Category",
    entity_name: "Sample Entity B",
  },
];

describe("RelatedListingsPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows selected Listings with Entity and status", () => {
    render(
      <RelatedListingsPanel
        articleId="article-1"
        selected={selected}
        listings={listings}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Related Listings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the public Article shows the latest marketplace Listings instead/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Sample Listing")).toBeInTheDocument();
    expect(screen.getByText("Sample Entity · Sample Category · Active")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("lets the operator add a Listing that is not already linked", () => {
    render(
      <RelatedListingsPanel
        articleId="article-1"
        selected={selected}
        listings={listings}
      />,
    );

    expect(screen.getByText("Second Sample Listing")).toBeInTheDocument();
    expect(
      screen.getByText("Sample Entity B · Sample Category · Inactive"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("filters the add list by title or Entity", () => {
    render(
      <RelatedListingsPanel
        articleId="article-1"
        selected={selected}
        listings={listings}
      />,
    );

    fireEvent.change(screen.getByLabelText("Search Listings"), {
      target: { value: "grooming" },
    });

    expect(screen.getByText("No matching Listings.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search Listings"), {
      target: { value: "sample entity b" },
    });

    expect(screen.getByText("Second Sample Listing")).toBeInTheDocument();
    expect(screen.queryByText("No matching Listings.")).not.toBeInTheDocument();
  });
});
