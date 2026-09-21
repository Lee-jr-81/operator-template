import { describe, expect, it } from "vitest";
import {
  ENTITY_LOGO_MAX_BYTES,
  entityLogoPath,
  validateEntityLogo,
} from "@/server/entities/logo";

function jpegFile(size: number) {
  const bytes = new Uint8Array(size);
  bytes[0] = 0xff;
  bytes[1] = 0xd8;
  bytes[2] = 0xff;
  return new File([bytes], "logo", { type: "image/jpeg" });
}

describe("validateEntityLogo", () => {
  it("accepts a JPEG under the size limit", async () => {
    await expect(validateEntityLogo(jpegFile(1024))).resolves.toEqual({
      extension: "jpg",
      contentType: "image/jpeg",
    });
  });

  it("rejects an unsupported type", async () => {
    await expect(
      validateEntityLogo(
        new File([new Uint8Array(1024)], "logo", { type: "image/gif" }),
      ),
    ).resolves.toEqual({
      error: "Use a JPEG, PNG, or WebP image for the logo.",
    });
  });

  it("rejects a file over 2MB", async () => {
    await expect(
      validateEntityLogo(jpegFile(ENTITY_LOGO_MAX_BYTES + 1)),
    ).resolves.toEqual({
      error: "Use a logo smaller than 2MB.",
    });
  });
});

describe("entityLogoPath", () => {
  it("stores logos under the Entity id", () => {
    expect(entityLogoPath("abc", "png")).toBe("abc/logo.png");
  });
});
