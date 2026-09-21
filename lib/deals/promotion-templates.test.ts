import { describe, expect, it } from "vitest";
import {
  generalPromotionCopy,
  shortPromotionCopy,
  type DealPromotionData,
} from "@/lib/deals/promotion-templates";

const withCode: DealPromotionData = {
  headline: "15% off your first course",
  description:
    "Book this sample listing before the end of September and receive 15% off.",
  listingTitle: "Sample Listing Course",
  entityName: "Sample Entity",
  promoCode: "SAMPLE15",
  expiresLabel: "30 September 2026",
  listingUrl: "http://localhost:3000/listings/sample-listing-course",
};

const withoutCode: DealPromotionData = {
  ...withCode,
  promoCode: null,
};

describe("promotion templates", () => {
  it("builds deterministic Facebook/general copy from Deal data", () => {
    expect(generalPromotionCopy(withCode)).toBe(
      [
        "Special offer: 15% off your first course",
        "Sample Entity is currently offering this on Sample Listing Course.",
        "Book this sample listing before the end of September and receive 15% off.",
        "Use code SAMPLE15 when booking.",
        "Offer ends 30 September 2026.",
        "View the details:\nhttp://localhost:3000/listings/sample-listing-course",
      ].join("\n\n"),
    );
  });

  it("builds deterministic short copy from Deal data", () => {
    expect(shortPromotionCopy(withCode)).toBe(
      [
        "15% off your first course — Sample Listing Course from Sample Entity.",
        "Use code SAMPLE15. Ends 30 September 2026.",
        "http://localhost:3000/listings/sample-listing-course",
      ].join("\n\n"),
    );
  });

  it("omits promo-code lines when no code is present", () => {
    expect(generalPromotionCopy(withoutCode)).not.toContain("Use code");
    expect(shortPromotionCopy(withoutCode)).toBe(
      [
        "15% off your first course — Sample Listing Course from Sample Entity.",
        "Ends 30 September 2026.",
        "http://localhost:3000/listings/sample-listing-course",
      ].join("\n\n"),
    );
  });

  it("includes the public Listing URL", () => {
    expect(generalPromotionCopy(withCode)).toContain(withCode.listingUrl);
    expect(shortPromotionCopy(withCode)).toContain(withCode.listingUrl);
  });
});
