import { describe, expect, it } from "vitest";
import {
  asListingStatus,
  isListingStatus,
  isPubliclyVisibleListing,
} from "@/server/listings/status";

describe("listing status", () => {
  it("allows only active and inactive", () => {
    expect(isListingStatus("active")).toBe(true);
    expect(isListingStatus("inactive")).toBe(true);
    expect(isListingStatus("draft")).toBe(false);
    expect(isListingStatus("sold")).toBe(false);
  });

  it("treats unknown values as inactive", () => {
    expect(asListingStatus("active")).toBe("active");
    expect(asListingStatus("draft")).toBe("inactive");
  });

  it("treats only active Listings as publicly visible", () => {
    expect(isPubliclyVisibleListing("active")).toBe(true);
    expect(isPubliclyVisibleListing("inactive")).toBe(false);
    expect(isPubliclyVisibleListing("draft")).toBe(false);
  });
});
