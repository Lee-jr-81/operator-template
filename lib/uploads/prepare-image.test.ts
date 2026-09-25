import { describe, expect, it } from "vitest";
import { fittedImageSize } from "@/lib/uploads/prepare-image";

describe("fittedImageSize", () => {
  it("leaves a photo that already fits unchanged", () => {
    expect(fittedImageSize(1600, 1200)).toEqual({ width: 1600, height: 1200 });
  });

  it("shrinks the long edge to 2000 pixels", () => {
    expect(fittedImageSize(4000, 3000)).toEqual({ width: 2000, height: 1500 });
    expect(fittedImageSize(3000, 4000)).toEqual({ width: 1500, height: 2000 });
  });
});
