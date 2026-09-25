import { describe, expect, it } from "vitest";
import {
  COVER_FOCAL_FALLBACK,
  coverPositionRatios,
  focalPointFromCoverPosition,
  focalPointFromPixels,
  objectPositionForCover,
} from "@/lib/media/cover-position";

function solid(width: number, height: number, color: [number, number, number]) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    pixels[index * 4] = color[0];
    pixels[index * 4 + 1] = color[1];
    pixels[index * 4 + 2] = color[2];
    pixels[index * 4 + 3] = 255;
  }
  return pixels;
}

function fillRect(
  pixels: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number],
) {
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const offset = (y * width + x) * 4;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
    }
  }
}

describe("focalPointFromPixels", () => {
  it("keeps a subject near the top of a tall photo", () => {
    const width = 30;
    const height = 60;
    const pixels = solid(width, height, [240, 240, 240]);
    fillRect(pixels, width, 8, 6, 22, 28, [20, 20, 20]);

    const point = focalPointFromPixels(pixels, width, height);

    expect(point.x).toBeGreaterThan(40);
    expect(point.x).toBeLessThan(65);
    expect(point.y).toBeLessThan(40);
  });

  it("follows a subject that sits low in the frame", () => {
    const width = 30;
    const height = 60;
    const pixels = solid(width, height, [240, 240, 240]);
    fillRect(pixels, width, 8, 40, 22, 56, [20, 20, 20]);

    const point = focalPointFromPixels(pixels, width, height);

    expect(point.y).toBeGreaterThan(60);
  });

  it("uses a point above centre when the photo has no subject", () => {
    const pixels = solid(20, 20, [180, 180, 180]);
    expect(focalPointFromPixels(pixels, 20, 20)).toEqual(COVER_FOCAL_FALLBACK);
  });
});

describe("objectPositionForCover", () => {
  it("pins a tall photo to the top of a wide frame when the subject is high", () => {
    expect(objectPositionForCover(50, 20, 0.75, 1.5)).toBe("50.0% 0.0%");
  });

  it("pins a tall photo to the bottom when the subject is low", () => {
    expect(objectPositionForCover(50, 80, 0.75, 1.5)).toBe("50.0% 100.0%");
  });

  it("leaves a matching ratio centred", () => {
    expect(objectPositionForCover(20, 20, 1.5, 1.5)).toBe("50.0% 50.0%");
  });

  it("recovers the focal point used to position the photo", () => {
    const position = coverPositionRatios(40, 30, 0.8, 1.6);
    expect(focalPointFromCoverPosition(position.x, position.y, 0.8, 1.6)).toEqual({
      x: 50,
      y: 30,
    });
  });
});
