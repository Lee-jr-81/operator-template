import { describe, expect, it } from "vitest";
import {
  isLocationInputEmpty,
  parseLocationInput,
  toPublicLocation,
} from "@/server/locations/validation";
import type { Location } from "@/server/locations/types";

const empty = {
  label: "",
  address_line_1: "",
  address_line_2: "",
  town_city: "",
  county_region: "",
  postcode: "",
  country: "",
  latitude: "",
  longitude: "",
};

describe("parseLocationInput", () => {
  it("treats a blank form as no Location", () => {
    expect(isLocationInputEmpty(empty)).toBe(true);
    expect(parseLocationInput(empty)).toEqual({ empty: true });
  });

  it("allows a town-only Location", () => {
    expect(
      parseLocationInput({
        ...empty,
        town_city: " Example Town ",
      }),
    ).toEqual({
      data: {
        label: "",
        address_line_1: "",
        address_line_2: "",
        town_city: "Example Town",
        county_region: "",
        postcode: "",
        country: "",
        latitude: null,
        longitude: null,
      },
    });
  });

  it("accepts optional coordinates in range", () => {
    const result = parseLocationInput({
      ...empty,
      town_city: "Example Town",
      latitude: "52.4574",
      longitude: "-2.1478",
    });

    expect("data" in result && result.data.latitude).toBe(52.4574);
    expect("data" in result && result.data.longitude).toBe(-2.1478);
  });

  it("rejects coordinates outside range", () => {
    expect(
      parseLocationInput({
        ...empty,
        latitude: "91",
        longitude: "-181",
      }),
    ).toEqual({
      fieldErrors: {
        latitude: "latitude must be between -90 and 90.",
        longitude: "longitude must be between -180 and 180.",
      },
    });
  });

  it("rejects non-numeric coordinates", () => {
    expect(
      parseLocationInput({
        ...empty,
        latitude: "north",
      }),
    ).toEqual({
      fieldErrors: {
        latitude: "Enter a valid latitude.",
      },
    });
  });
});

describe("toPublicLocation", () => {
  it("omits street address fields", () => {
    const location: Location = {
      id: "loc-1",
      label: "Main Service Area",
      address_line_1: "12 Private Lane",
      address_line_2: "Rear office",
      town_city: "Example Town",
      county_region: "Example County",
      postcode: "DY8 1AA",
      country: "United Kingdom",
      latitude: 52.45,
      longitude: -2.14,
      created_at: "2026-08-17T12:00:00.000Z",
      updated_at: "2026-08-17T12:00:00.000Z",
    };

    const publicLocation = toPublicLocation(location);

    expect(publicLocation).not.toHaveProperty("address_line_1");
    expect(publicLocation).not.toHaveProperty("address_line_2");
    expect(publicLocation).not.toHaveProperty("id");
    expect(publicLocation.town_city).toBe("Example Town");
  });
});
