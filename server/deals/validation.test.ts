import { describe, expect, it } from "vitest";
import {
  DEAL_HEADLINE_MAX,
  DEAL_OVERLAP_MESSAGE,
  overlappingActiveDealError,
  parseDealInput,
  toPublicDeal,
} from "@/server/deals/validation";

const now = new Date("2026-08-18T12:00:00.000Z");

const valid = {
  listing_id: "11111111-1111-1111-1111-111111111111",
  headline: "15% off your first course",
  description:
    "Book this sample listing before the end of September and receive 15% off.",
  promo_code: "SAMPLE15",
  starts_at: "",
  expires_at: "2026-09-30T17:00:00.000Z",
  is_active: "true",
};

describe("parseDealInput", () => {
  it("requires Listing, headline, description, and expiry", () => {
    const result = parseDealInput(
      {
        listing_id: "  ",
        headline: "",
        description: "",
        promo_code: "",
        starts_at: "",
        expires_at: "",
        is_active: "",
      },
      { requireFutureExpiry: true, now },
    );

    expect(result).toEqual({
      fieldErrors: {
        listing_id: "Choose a Listing.",
        headline: "Enter a Deal headline.",
        description: "Explain what the visitor gets.",
        expires_at: "Enter an expiry date and time.",
      },
    });
  });

  it("stores a trimmed optional promo code and empty start as null", () => {
    const result = parseDealInput(valid, { requireFutureExpiry: true, now });

    expect(result).toEqual({
      data: {
        listing_id: valid.listing_id,
        headline: "15% off your first course",
        description: valid.description,
        promo_code: "SAMPLE15",
        starts_at: null,
        expires_at: "2026-09-30T17:00:00.000Z",
        is_active: true,
      },
    });
  });

  it("treats a blank promo code as omitted", () => {
    const result = parseDealInput(
      { ...valid, promo_code: "   " },
      { requireFutureExpiry: true, now },
    );

    expect("data" in result && result.data.promo_code).toBeNull();
  });

  it("requires expiry after start", () => {
    const result = parseDealInput(
      {
        ...valid,
        starts_at: "2026-10-01T09:00:00.000Z",
        expires_at: "2026-09-01T09:00:00.000Z",
      },
      { requireFutureExpiry: true, now },
    );

    expect(result).toEqual({
      fieldErrors: {
        expires_at: "Expiry must be after the start date.",
      },
    });
  });

  it("requires a future expiry when creating a Deal", () => {
    const result = parseDealInput(
      { ...valid, expires_at: "2026-08-01T09:00:00.000Z" },
      { requireFutureExpiry: true, now },
    );

    expect(result).toEqual({
      fieldErrors: {
        expires_at: "Expiry must be in the future.",
      },
    });
  });

  it("allows a past expiry when editing an existing Deal", () => {
    const result = parseDealInput(
      { ...valid, expires_at: "2026-08-01T09:00:00.000Z" },
      { requireFutureExpiry: false, now },
    );

    expect("data" in result).toBe(true);
  });

  it("rejects a headline that is too long", () => {
    const result = parseDealInput(
      { ...valid, headline: "x".repeat(DEAL_HEADLINE_MAX + 1) },
      { requireFutureExpiry: true, now },
    );

    expect(result).toEqual({
      fieldErrors: {
        headline: `Use ${DEAL_HEADLINE_MAX} characters or fewer.`,
      },
    });
  });
});

describe("overlappingActiveDealError", () => {
  const existing = {
    id: "deal-1",
    is_active: true,
    starts_at: null,
    expires_at: "2026-09-30T17:00:00.000Z",
  };

  it("prevents overlapping active windows on the same Listing", () => {
    expect(
      overlappingActiveDealError(
        {
          is_active: true,
          starts_at: "2026-09-01T00:00:00.000Z",
          expires_at: "2026-10-15T00:00:00.000Z",
        },
        [existing],
      ),
    ).toBe(DEAL_OVERLAP_MESSAGE);
  });

  it("ignores inactive candidates and the Deal being edited", () => {
    expect(
      overlappingActiveDealError(
        {
          is_active: false,
          starts_at: null,
          expires_at: "2026-10-15T00:00:00.000Z",
        },
        [existing],
      ),
    ).toBeUndefined();

    expect(
      overlappingActiveDealError(
        {
          is_active: true,
          starts_at: null,
          expires_at: "2026-10-15T00:00:00.000Z",
        },
        [existing],
        "deal-1",
      ),
    ).toBeUndefined();
  });
});

describe("toPublicDeal", () => {
  it("projects only public Deal fields", () => {
    expect(
      toPublicDeal({
        id: "deal-1",
        headline: "15% off your first course",
        description: "Book before the end of September.",
        promo_code: "SAMPLE15",
        starts_at: null,
        expires_at: "2026-09-30T17:00:00.000Z",
      }),
    ).toEqual({
      id: "deal-1",
      headline: "15% off your first course",
      description: "Book before the end of September.",
      promo_code: "SAMPLE15",
      starts_at: null,
      expires_at: "2026-09-30T17:00:00.000Z",
    });
  });
});
