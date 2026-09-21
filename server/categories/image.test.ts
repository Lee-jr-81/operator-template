import { describe, expect, it } from "vitest";
import {
  CATEGORY_IMAGE_REQUIRED_MESSAGE,
  categoryImagePath,
  readCategoryImageFile,
  validateCategoryImageFile,
} from "@/server/categories/image";

describe("readCategoryImageFile", () => {
  it("returns null for a missing or empty file", () => {
    expect(readCategoryImageFile(new FormData())).toBeNull();

    const empty = new FormData();
    empty.set("image", new File([], "empty.jpg", { type: "image/jpeg" }));
    expect(readCategoryImageFile(empty)).toBeNull();
  });
});

describe("validateCategoryImageFile", () => {
  it("accepts a JPEG under 5MB", async () => {
    const bytes = new Uint8Array(12);
    bytes[0] = 0xff;
    bytes[1] = 0xd8;
    bytes[2] = 0xff;
    const file = new File([bytes], "category.jpg", { type: "image/jpeg" });

    await expect(validateCategoryImageFile(file)).resolves.toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects an empty file and unsupported type", async () => {
    const empty = new File([], "empty.jpg", { type: "image/jpeg" });
    const gif = new File([new Uint8Array(12)], "category.gif", {
      type: "image/gif",
    });

    await expect(validateCategoryImageFile(empty)).resolves.toEqual({
      error: CATEGORY_IMAGE_REQUIRED_MESSAGE,
    });
    await expect(validateCategoryImageFile(gif)).resolves.toEqual({
      error: "Use a JPEG, PNG, or WebP image.",
    });
  });
});

describe("categoryImagePath", () => {
  it("stores the file under the Category id", () => {
    expect(categoryImagePath("category-1", "media-1", "webp")).toBe(
      "category-1/media-1.webp",
    );
  });
});
