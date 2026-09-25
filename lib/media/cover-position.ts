export const COVER_FOCAL_FALLBACK = { x: 50, y: 32 };
export const COVER_POSITION_FALLBACK = "50% 32%";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Finds a point worth keeping in frame. Strong edges usually belong to the
 * subject. The point sits near the top of that region. A flat or busy
 * photo falls back to a point above centre.
 */
export function focalPointFromPixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
) {
  if (width < 3 || height < 3) {
    return COVER_FOCAL_FALLBACK;
  }

  const luminance = new Float32Array(width * height);
  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    luminance[index] =
      pixels[offset] * 0.2126 +
      pixels[offset + 1] * 0.7152 +
      pixels[offset + 2] * 0.0722;
  }

  const energy: number[] = [];
  const indexes: number[] = [];
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const magnitude =
        Math.abs(luminance[index + 1] - luminance[index - 1]) +
        Math.abs(luminance[index + width] - luminance[index - width]);
      energy.push(magnitude);
      indexes.push(index);
    }
  }

  const ranked = energy
    .map((value, entry) => ({ value, index: indexes[entry] }))
    .sort((left, right) => right.value - left.value);
  const maxEnergy = ranked[0]?.value ?? 0;
  if (maxEnergy < 4) {
    return COVER_FOCAL_FALLBACK;
  }

  const strongest = ranked.filter((point) => point.value >= maxEnergy * 0.45);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  let sumX = 0;
  let sumY = 0;

  for (const point of strongest) {
    const x = point.index % width;
    const y = Math.floor(point.index / width);
    count += 1;
    sumX += x;
    sumY += y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  if (strongest.length === 0) {
    return COVER_FOCAL_FALLBACK;
  }

  const boxArea = (maxX - minX + 1) * (maxY - minY + 1);
  const subjectFillsTheFrame = boxArea / (width * height) > 0.75;
  const x = subjectFillsTheFrame ? sumX / count : (minX + maxX) / 2;
  const y = subjectFillsTheFrame
    ? sumY / count - height * 0.08
    : minY + (maxY - minY + 1) * 0.28;

  return {
    x: clamp((x / (width - 1)) * 100, 0, 100),
    y: clamp((y / (height - 1)) * 100, 0, 100),
  };
}

export function focalPointFromImage(image: HTMLImageElement) {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = longest > 48 ? 48 / longest : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return COVER_FOCAL_FALLBACK;
  }

  try {
    context.drawImage(image, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);
    return focalPointFromPixels(data, width, height);
  } catch {
    return COVER_FOCAL_FALLBACK;
  }
}

/**
 * object-fit: cover alignment that keeps a point in the image inside the frame.
 * Percentages are 0–100. The frame ratio is left unchanged.
 * Returns ratios from 0 to 1.
 */
export function coverPositionRatios(
  focalX: number,
  focalY: number,
  imageAspect: number,
  frameAspect: number,
) {
  if (imageAspect <= 0 || frameAspect <= 0) {
    return { x: 0.5, y: 0.32 };
  }

  const focusX = clamp(focalX, 0, 100) / 100;
  const focusY = clamp(focalY, 0, 100) / 100;
  let x = 0.5;
  let y = 0.5;

  if (imageAspect > frameAspect) {
    x = clamp(
      (frameAspect / 2 - focusX * imageAspect) / (frameAspect - imageAspect),
      0,
      1,
    );
  } else if (imageAspect < frameAspect) {
    y = clamp(
      (imageAspect / 2 - focusY * frameAspect) / (imageAspect - frameAspect),
      0,
      1,
    );
  }

  return { x, y };
}

export function objectPositionForCover(
  focalX: number,
  focalY: number,
  imageAspect: number,
  frameAspect: number,
) {
  const position = coverPositionRatios(focalX, focalY, imageAspect, frameAspect);
  return `${(position.x * 100).toFixed(1)}% ${(position.y * 100).toFixed(1)}%`;
}

/** Inverse of coverPositionRatios. Percentages are 0–1 in, 0–100 out. */
export function focalPointFromCoverPosition(
  positionX: number,
  positionY: number,
  imageAspect: number,
  frameAspect: number,
) {
  const xRatio = clamp(positionX, 0, 1);
  const yRatio = clamp(positionY, 0, 1);
  let x = 50;
  let y = 50;

  if (imageAspect > frameAspect) {
    x =
      ((frameAspect / 2 - xRatio * (frameAspect - imageAspect)) / imageAspect) *
      100;
  }

  if (imageAspect < frameAspect) {
    y =
      ((imageAspect / 2 - yRatio * (imageAspect - frameAspect)) / frameAspect) *
      100;
  }

  return {
    x: clamp(Math.round(x), 0, 100),
    y: clamp(Math.round(y), 0, 100),
  };
}
