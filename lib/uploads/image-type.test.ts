import { describe, expect, it } from "vitest";
import { detectImageType, validateSafeImageFile } from "@/lib/uploads/image-type";

function jpegBytes(size = 32) {
  const bytes = new Uint8Array(size);
  bytes[0] = 0xff;
  bytes[1] = 0xd8;
  bytes[2] = 0xff;
  return bytes;
}

describe("detectImageType", () => {
  it("recognises JPEG, PNG, and WebP magic bytes", () => {
    expect(detectImageType(jpegBytes())?.contentType).toBe("image/jpeg");

    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(detectImageType(png)?.contentType).toBe("image/png");

    const webp = new Uint8Array(12);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50], 8);
    expect(detectImageType(webp)?.contentType).toBe("image/webp");
  });

  it("rejects HTML labelled as JPEG", () => {
    const html = new TextEncoder().encode("<script>alert(1)</script>");
    expect(detectImageType(html)).toBeNull();
  });
});

describe("validateSafeImageFile", () => {
  it("accepts a JPEG by contents, not the client MIME type", async () => {
    const file = new File([jpegBytes(64)], "photo.gif", { type: "image/gif" });
    await expect(
      validateSafeImageFile(file, {
        maxBytes: 1024,
        emptyMessage: "empty",
        sizeMessage: "too big",
        typeMessage: "bad type",
      }),
    ).resolves.toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects a spoofed JPEG MIME type with HTML contents", async () => {
    const file = new File(["<html></html>"], "photo.jpg", {
      type: "image/jpeg",
    });
    await expect(
      validateSafeImageFile(file, {
        maxBytes: 1024,
        emptyMessage: "empty",
        sizeMessage: "too big",
        typeMessage: "bad type",
      }),
    ).resolves.toEqual({ error: "bad type" });
  });
});
