import { describe, expect, it, vi } from "vitest";
import {
  POSTCODE_LOOKUP_DISABLED_MESSAGE,
  POSTCODE_LOOKUP_EMPTY_MESSAGE,
  POSTCODE_LOOKUP_NO_COORDINATES_MESSAGE,
  POSTCODE_LOOKUP_NOT_FOUND_MESSAGE,
  POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE,
  lookupUkPostcode,
  normalizePostcodeInput,
} from "@/lib/location/postcodes-io";

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("normalizePostcodeInput", () => {
  it("trims, collapses spaces, and uppercases", () => {
    expect(normalizePostcodeInput("  dy8  1aa ")).toBe("DY8 1AA");
  });
});

describe("lookupUkPostcode", () => {
  it("maps a successful Postcodes.io response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        status: 200,
        result: {
          postcode: "DY8 1AA",
          latitude: 52.4567,
          longitude: -2.1432,
        },
      }),
    );

    await expect(
      lookupUkPostcode("dy8 1aa", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: true,
      postcode: "DY8 1AA",
      latitude: 52.4567,
      longitude: -2.1432,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("https://api.postcodes.io/postcodes/DY8%201AA");
  });

  it("does not call the API when geocoding is disabled", async () => {
    const fetchMock = vi.fn();

    await expect(
      lookupUkPostcode("DY8 1AA", { fetch: fetchMock, enabled: false }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_DISABLED_MESSAGE,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an empty postcode without calling the API", async () => {
    const fetchMock = vi.fn();

    await expect(
      lookupUkPostcode("   ", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_EMPTY_MESSAGE,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized postcode without calling the API", async () => {
    const fetchMock = vi.fn();

    await expect(
      lookupUkPostcode("X".repeat(20), { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_NOT_FOUND_MESSAGE,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a not-found message for unknown postcodes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(404, { status: 404, error: "Postcode not found" }));

    await expect(
      lookupUkPostcode("ZZ1 1ZZ", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_NOT_FOUND_MESSAGE,
    });
  });

  it("returns an unavailable message for an HTTP 500", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(500, { status: 500, error: "crash" }));

    await expect(
      lookupUkPostcode("DY8 1AA", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE,
    });
  });

  it("returns an unavailable message for a network failure", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));

    await expect(
      lookupUkPostcode("DY8 1AA", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_UNAVAILABLE_MESSAGE,
    });
  });

  it("handles a successful response with null coordinates", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        status: 200,
        result: {
          postcode: "GY1 1AA",
          latitude: null,
          longitude: null,
        },
      }),
    );

    await expect(
      lookupUkPostcode("GY1 1AA", { fetch: fetchMock, enabled: true }),
    ).resolves.toEqual({
      ok: false,
      message: POSTCODE_LOOKUP_NO_COORDINATES_MESSAGE,
    });
  });
});
