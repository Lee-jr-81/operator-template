import { describe, expect, it } from "vitest";
import {
  LISTING_MEDIA_MAX_BYTES,
  LISTING_MEDIA_MAX_PER_LISTING,
  canAddListingMedia,
  galleryHeroAndRest,
  listingMediaPath,
  neighborForMove,
  nextPrimaryIdAfterDelete,
  nextSortOrder,
  parseListingMediaAltText,
  shouldBecomePrimary,
  validateListingMediaFile,
} from "@/server/listings/media";

function jpegFile(size: number, type = "image/jpeg") {
  const bytes = new Uint8Array(size);
  bytes[0] = 0xff;
  bytes[1] = 0xd8;
  bytes[2] = 0xff;
  return new File([bytes], "photo", { type });
}

describe("validateListingMediaFile", () => {
  it("accepts a JPEG under the size limit", async () => {
    await expect(validateListingMediaFile(jpegFile(1024))).resolves.toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects an unsupported type", async () => {
    await expect(
      validateListingMediaFile(new File([new Uint8Array(1024)], "photo", {
        type: "image/gif",
      })),
    ).resolves.toEqual({
      error: "Use a JPEG, PNG, or WebP image.",
    });
  });

  it("rejects a file over 5MB", async () => {
    await expect(
      validateListingMediaFile(jpegFile(LISTING_MEDIA_MAX_BYTES + 1)),
    ).resolves.toEqual({
      error: "Use an image smaller than 5MB.",
    });
  });
});

describe("parseListingMediaAltText", () => {
  it("trims alt text", () => {
    expect(parseListingMediaAltText("  Group photo  ")).toEqual({
      alt_text: "Group photo",
    });
  });

  it("rejects alt text that is too long", () => {
    expect(parseListingMediaAltText("x".repeat(161))).toEqual({
      error: "Use 160 characters or fewer.",
    });
  });
});

describe("listing media helpers", () => {
  it("stores files under the Listing id and media id", () => {
    expect(listingMediaPath("listing-1", "media-1", "webp")).toBe(
      "listing-1/media-1.webp",
    );
  });

  it("makes the first uploaded image primary", () => {
    expect(shouldBecomePrimary(0)).toBe(true);
    expect(shouldBecomePrimary(1)).toBe(false);
  });

  it("caps the number of images per Listing", () => {
    expect(canAddListingMedia(LISTING_MEDIA_MAX_PER_LISTING - 1)).toBe(true);
    expect(canAddListingMedia(LISTING_MEDIA_MAX_PER_LISTING)).toBe(false);
  });

  it("appends new images after the current sort order", () => {
    expect(nextSortOrder([])).toBe(0);
    expect(nextSortOrder([{ sort_order: 0 }, { sort_order: 2 }])).toBe(3);
  });

  it("promotes the next image when the primary is deleted", () => {
    expect(
      nextPrimaryIdAfterDelete(
        [
          { id: "a", is_primary: true, sort_order: 0 },
          { id: "b", is_primary: false, sort_order: 1 },
        ],
        "a",
      ),
    ).toBe("b");
  });

  it("keeps the existing primary when a non-primary image is deleted", () => {
    expect(
      nextPrimaryIdAfterDelete(
        [
          { id: "a", is_primary: true, sort_order: 0 },
          { id: "b", is_primary: false, sort_order: 1 },
        ],
        "b",
      ),
    ).toBe("a");
  });

  it("leaves no primary when the last image is deleted", () => {
    expect(
      nextPrimaryIdAfterDelete(
        [{ id: "a", is_primary: true, sort_order: 0 }],
        "a",
      ),
    ).toBeNull();
  });

  it("swaps with the neighbor when moving up or down", () => {
    const items = [
      { id: "a", sort_order: 0 },
      { id: "b", sort_order: 1 },
      { id: "c", sort_order: 2 },
    ];

    expect(neighborForMove(items, "b", "up")).toEqual({
      current: { id: "b", sort_order: 1 },
      neighbor: { id: "a", sort_order: 0 },
    });
    expect(neighborForMove(items, "b", "down")?.neighbor.id).toBe("c");
    expect(neighborForMove(items, "a", "up")).toBeNull();
  });

  it("uses the primary image as the gallery hero", () => {
    const images = [
      { id: "a", is_primary: false },
      { id: "b", is_primary: true },
    ];
    const { hero, rest } = galleryHeroAndRest(images);
    expect(hero?.id).toBe("b");
    expect(rest.map((item) => item.id)).toEqual(["a"]);
  });
});
