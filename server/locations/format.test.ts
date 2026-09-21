import { describe, expect, it } from "vitest";
import { formatConciseLocation } from "@/server/locations/format";

describe("formatConciseLocation", () => {
  it("joins town and county", () => {
    expect(
      formatConciseLocation({
        town_city: "Example Town",
        county_region: "Example County",
      }),
    ).toBe("Example Town, Example County");
  });

  it("returns a single part when only town is present", () => {
    expect(
      formatConciseLocation({
        town_city: "Example Town",
        county_region: "",
      }),
    ).toBe("Example Town");
  });

  it("returns null when there is nothing concise to show", () => {
    expect(
      formatConciseLocation({
        town_city: "",
        county_region: "  ",
      }),
    ).toBeNull();
    expect(formatConciseLocation(null)).toBeNull();
  });
});
