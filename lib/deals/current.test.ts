import { describe, expect, it } from "vitest";
import {
  dealWindowsOverlap,
  getDealState,
  isCurrentDeal,
  isPubliclyVisibleDeal,
  selectCurrentDeal,
} from "@/lib/deals/current";

const now = new Date("2026-08-18T12:00:00.000Z");

function deal(overrides: {
  is_active?: boolean;
  starts_at?: string | null;
  expires_at?: string;
}) {
  return {
    is_active: overrides.is_active ?? true,
    starts_at: overrides.starts_at ?? null,
    expires_at: overrides.expires_at ?? "2026-09-30T17:00:00.000Z",
  };
}

describe("getDealState", () => {
  it("treats inactive Deals as Inactive even inside the date window", () => {
    expect(getDealState(deal({ is_active: false }), now)).toBe("inactive");
  });

  it("treats a future start as Scheduled", () => {
    expect(
      getDealState(
        deal({ starts_at: "2026-09-01T09:00:00.000Z" }),
        now,
      ),
    ).toBe("scheduled");
  });

  it("treats an in-window active Deal as Live", () => {
    expect(getDealState(deal({ starts_at: null }), now)).toBe("live");
    expect(
      getDealState(
        deal({ starts_at: "2026-08-01T09:00:00.000Z" }),
        now,
      ),
    ).toBe("live");
  });

  it("treats a passed expiry as Expired", () => {
    expect(
      getDealState(
        deal({ expires_at: "2026-08-01T09:00:00.000Z" }),
        now,
      ),
    ).toBe("expired");
  });
});

describe("isCurrentDeal and public visibility", () => {
  it("is current only while Live", () => {
    expect(isCurrentDeal(deal({}), now)).toBe(true);
    expect(
      isCurrentDeal(deal({ starts_at: "2026-09-01T09:00:00.000Z" }), now),
    ).toBe(false);
    expect(
      isCurrentDeal(deal({ expires_at: "2026-08-01T09:00:00.000Z" }), now),
    ).toBe(false);
    expect(isCurrentDeal(deal({ is_active: false }), now)).toBe(false);
  });

  it("hides a current Deal when the parent Listing is inactive", () => {
    expect(isPubliclyVisibleDeal(deal({}), "active", now)).toBe(true);
    expect(isPubliclyVisibleDeal(deal({}), "inactive", now)).toBe(false);
  });

  it("selects the current Deal with the nearest expiry", () => {
    const selected = selectCurrentDeal(
      [
        deal({ expires_at: "2026-10-30T17:00:00.000Z" }),
        deal({ expires_at: "2026-09-15T17:00:00.000Z" }),
        deal({ is_active: false }),
      ],
      now,
    );

    expect(selected?.expires_at).toBe("2026-09-15T17:00:00.000Z");
  });
});

describe("dealWindowsOverlap", () => {
  it("detects overlapping active windows", () => {
    expect(
      dealWindowsOverlap(
        {
          starts_at: "2026-09-01T00:00:00.000Z",
          expires_at: "2026-09-30T00:00:00.000Z",
        },
        {
          starts_at: "2026-09-15T00:00:00.000Z",
          expires_at: "2026-10-15T00:00:00.000Z",
        },
      ),
    ).toBe(true);
  });

  it("allows adjacent windows that meet at expiry", () => {
    expect(
      dealWindowsOverlap(
        {
          starts_at: null,
          expires_at: "2026-09-30T00:00:00.000Z",
        },
        {
          starts_at: "2026-09-30T00:00:00.000Z",
          expires_at: "2026-10-30T00:00:00.000Z",
        },
      ),
    ).toBe(false);
  });
});
