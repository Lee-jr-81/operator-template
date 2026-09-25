export const UPLOAD_IMAGE_MAX_EDGE = 2000;
export const UPLOAD_IMAGE_TARGET_BYTES = 1_500_000;

export function fittedImageSize(
  width: number,
  height: number,
  maxEdge = UPLOAD_IMAGE_MAX_EDGE,
) {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  const longest = Math.max(safeWidth, safeHeight);

  if (longest <= maxEdge) {
    return { width: safeWidth, height: safeHeight };
  }

  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(safeWidth * scale)),
    height: Math.max(1, Math.round(safeHeight * scale)),
  };
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

async function encodeJpeg(bitmap: ImageBitmap, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("This image could not be prepared. Please try again.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.82;
  let blob = await canvasBlob(canvas, quality);
  while (blob && blob.size > UPLOAD_IMAGE_TARGET_BYTES && quality > 0.5) {
    quality = Math.round((quality - 0.1) * 10) / 10;
    blob = await canvasBlob(canvas, quality);
  }

  if (!blob) {
    throw new Error("This image could not be prepared. Please try again.");
  }

  return blob;
}

export async function prepareImageForUpload(file: File) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image could not be prepared. Use a JPEG, PNG, or WebP.");
  }

  try {
    const fitted = fittedImageSize(bitmap.width, bitmap.height);
    const alreadySuitable =
      file.size <= UPLOAD_IMAGE_TARGET_BYTES &&
      fitted.width === bitmap.width &&
      fitted.height === bitmap.height &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp");

    if (alreadySuitable) {
      return file;
    }

    const blob = await encodeJpeg(bitmap, fitted.width, fitted.height);
    const base = file.name.replace(/\.[^.]+$/, "").trim() || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
