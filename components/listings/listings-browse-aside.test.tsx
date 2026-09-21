import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingsBrowseAside } from "@/components/listings/listings-browse-aside";

describe("ListingsBrowseAside", () => {
  it("links Categories and submit on the listings rail", () => {
    render(
      <ListingsBrowseAside
        categories={[{ name: "Sample Category", slug: "sample-category" }]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Category" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse by")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sample Category" })).toHaveAttribute(
      "href",
      "/categories/sample-category",
    );
    expect(
      screen.queryByRole("link", { name: /all categories/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Submit a listing" }),
    ).toHaveAttribute("href", "/login");
  });
});
