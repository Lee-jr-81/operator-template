export type DetectedImage = {
  extension: "jpg" | "png" | "webp";
  contentType: "image/jpeg" | "image/png" | "image/webp";
};

export function detectImageType(bytes: Uint8Array): DetectedImage | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { extension: "png", contentType: "image/png" };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { extension: "webp", contentType: "image/webp" };
  }

  return null;
}

export async function validateSafeImageFile(
  file: File,
  options: {
    maxBytes: number;
    emptyMessage: string;
    sizeMessage: string;
    typeMessage: string;
  },
): Promise<DetectedImage | { error: string }> {
  if (file.size === 0) {
    return { error: options.emptyMessage };
  }

  if (file.size > options.maxBytes) {
    return { error: options.sizeMessage };
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const detected = detectImageType(header);
  if (!detected) {
    return { error: options.typeMessage };
  }

  return detected;
}
