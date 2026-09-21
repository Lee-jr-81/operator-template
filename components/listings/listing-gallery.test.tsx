import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ListingGallery } from "@/components/listings/listing-gallery";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

const sixPhotos = [
  { url: "https://cdn.example/1.jpg", alt: "One", is_primary: true },
  { url: "https://cdn.example/2.jpg", alt: "Two", is_primary: false },
  { url: "https://cdn.example/3.jpg", alt: "Three", is_primary: false },
  { url: "https://cdn.example/4.jpg", alt: "Four", is_primary: false },
  { url: "https://cdn.example/5.jpg", alt: "Five", is_primary: false },
  { url: "https://cdn.example/6.jpg", alt: "Six", is_primary: false },
];

describe("ListingGallery", () => {
  it("opens a viewer for a single photo", () => {
    render(
      <ListingGallery
        images={[
          {
            url: "https://cdn.example/hero.jpg",
            alt: "Hero",
            is_primary: true,
          },
        ]}
        title="Sample Listing"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "View photo" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("1 / 1")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next photo" }),
    ).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("builds a mosaic and lets visitors step through leftover photos", () => {
    render(
      <ListingGallery images={sixPhotos} title="Sample Listing" />,
    );

    expect(screen.getByRole("button", { name: "Show all photos" })).toBeInTheDocument();
    expect(screen.getByText("+1 more")).toBeInTheDocument();
    expect(screen.queryByAltText("Six")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Photo 2 of 6" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("2 / 6")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(within(dialog).getByText("3 / 6")).toBeInTheDocument();
  });
});
