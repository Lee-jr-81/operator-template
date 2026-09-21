import { POSTCODE_GEOCODING_ENABLED } from "@/lib/location/config";

export const POSTCODE_LOOKUP_EMPTY_MESSAGE = "Enter a postcode.";

export const POSTCODE_LOOKUP_NOT_FOUND_MESSAGE =
  "Postcode not found. Check the postcode and try again.";

export const POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE =
  "Location lookup is temporarily unavailable. Try again or enter coordinates manually under Advanced.";

export const POSTCODE_LOOKUP_NO_COORDINATES_MESSAGE =
  "This postcode could not be placed on the map. Enter coordinates manually under Advanced.";

export const POSTCODE_LOOKUP_DISABLED_MESSAGE =
  "Postcode lookup is not enabled for this clone.";

export const POSTCODE_LOOKUP_TIMEOUT_MS = 8000;
export const POSTCODE_LOOKUP_MAX_LENGTH = 12;

const POSTCODES_IO_LOOKUP_URL = "https://api.postcodes.io/postcodes/";

export type PostcodeLookupResult =
  | {
      ok: true;
      postcode: string;
      latitude: number;
      longitude: number;
    }
  | {
      ok: false;
      message: string;
    };

type LookupFetch = (
  url: string,
  init?: RequestInit,
) => Promise<Pick<Response, "ok" | "status" | "json">>;

type PostcodesIoBody = {
  status?: number;
  result?: {
    postcode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

export function normalizePostcodeInput(raw: string) {
  return raw.trim().replace(/\s+/g, " ").toUpperCase();
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function lookupUkPostcode(
  rawPostcode: string,
  options?: {
    fetch?: LookupFetch;
    enabled?: boolean;
    timeoutMs?: number;
  },
): Promise<PostcodeLookupResult> {
  const enabled = options?.enabled ?? POSTCODE_GEOCODING_ENABLED;

  if (!enabled) {
    return { ok: false, message: POSTCODE_LOOKUP_DISABLED_MESSAGE };
  }

  const postcode = normalizePostcodeInput(rawPostcode);
  if (!postcode) {
    return { ok: false, message: POSTCODE_LOOKUP_EMPTY_MESSAGE };
  }

  if (postcode.length > POSTCODE_LOOKUP_MAX_LENGTH) {
    return { ok: false, message: POSTCODE_LOOKUP_NOT_FOUND_MESSAGE };
  }

  const fetchFn = options?.fetch ?? fetch;
  const timeoutMs = options?.timeoutMs ?? POSTCODE_LOOKUP_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(
      `${POSTCODES_IO_LOOKUP_URL}${encodeURIComponent(postcode)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );

    if (response.status === 404 || response.status === 400) {
      return { ok: false, message: POSTCODE_LOOKUP_NOT_FOUND_MESSAGE };
    }

    if (!response.ok) {
      return { ok: false, message: POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE };
    }

    let body: PostcodesIoBody;
    try {
      body = (await response.json()) as PostcodesIoBody;
    } catch {
      return { ok: false, message: POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE };
    }

    const result = body.result;
    if (!result) {
      return { ok: false, message: POSTCODE_LOOKUP_NOT_FOUND_MESSAGE };
    }

    if (!isFiniteNumber(result.latitude) || !isFiniteNumber(result.longitude)) {
      return { ok: false, message: POSTCODE_LOOKUP_NO_COORDINATES_MESSAGE };
    }

    if (
      result.latitude < -90 ||
      result.latitude > 90 ||
      result.longitude < -180 ||
      result.longitude > 180
    ) {
      return { ok: false, message: POSTCODE_LOOKUP_NO_COORDINATES_MESSAGE };
    }

    return {
      ok: true,
      postcode: result.postcode?.trim() || postcode,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch {
    return { ok: false, message: POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE };
  } finally {
    clearTimeout(timeout);
  }
}
