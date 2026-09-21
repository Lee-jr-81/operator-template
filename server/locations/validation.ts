import type {
  Location,
  LocationFieldErrors,
  LocationInput,
  PublicLocation,
} from "@/server/locations/types";

export const LOCATION_LABEL_MAX = 80;
export const LOCATION_ADDRESS_MAX = 120;
export const LOCATION_TOWN_MAX = 80;
export const LOCATION_COUNTY_MAX = 80;
export const LOCATION_POSTCODE_MAX = 20;
export const LOCATION_COUNTRY_MAX = 80;

const COORDINATE_PATTERN = /^-?\d+(\.\d+)?$/;

export function hasLocationFieldErrors(fieldErrors: LocationFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

export function isLocationInputEmpty(raw: {
  label: string;
  address_line_1: string;
  address_line_2: string;
  town_city: string;
  county_region: string;
  postcode: string;
  country: string;
  latitude: string;
  longitude: string;
}) {
  return (
    !raw.label.trim() &&
    !raw.address_line_1.trim() &&
    !raw.address_line_2.trim() &&
    !raw.town_city.trim() &&
    !raw.county_region.trim() &&
    !raw.postcode.trim() &&
    !raw.country.trim() &&
    !raw.latitude.trim() &&
    !raw.longitude.trim()
  );
}

function parseOptionalCoordinate(
  raw: string,
  min: number,
  max: number,
  label: string,
): { value: number | null } | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { value: null };
  }

  if (!COORDINATE_PATTERN.test(trimmed)) {
    return { error: `Enter a valid ${label}.` };
  }

  const value = Number(trimmed);
  if (value < min || value > max) {
    return { error: `${label} must be between ${min} and ${max}.` };
  }

  return { value };
}

export function parseLocationInput(raw: {
  label: string;
  address_line_1: string;
  address_line_2: string;
  town_city: string;
  county_region: string;
  postcode: string;
  country: string;
  latitude: string;
  longitude: string;
}):
  | { empty: true }
  | { data: LocationInput }
  | { fieldErrors: LocationFieldErrors } {
  if (isLocationInputEmpty(raw)) {
    return { empty: true };
  }

  const label = raw.label.trim();
  const addressLine1 = raw.address_line_1.trim();
  const addressLine2 = raw.address_line_2.trim();
  const townCity = raw.town_city.trim();
  const countyRegion = raw.county_region.trim();
  const postcode = raw.postcode.trim();
  const country = raw.country.trim();
  const fieldErrors: LocationFieldErrors = {};

  if (label.length > LOCATION_LABEL_MAX) {
    fieldErrors.label = `Use ${LOCATION_LABEL_MAX} characters or fewer.`;
  }
  if (addressLine1.length > LOCATION_ADDRESS_MAX) {
    fieldErrors.address_line_1 = `Use ${LOCATION_ADDRESS_MAX} characters or fewer.`;
  }
  if (addressLine2.length > LOCATION_ADDRESS_MAX) {
    fieldErrors.address_line_2 = `Use ${LOCATION_ADDRESS_MAX} characters or fewer.`;
  }
  if (townCity.length > LOCATION_TOWN_MAX) {
    fieldErrors.town_city = `Use ${LOCATION_TOWN_MAX} characters or fewer.`;
  }
  if (countyRegion.length > LOCATION_COUNTY_MAX) {
    fieldErrors.county_region = `Use ${LOCATION_COUNTY_MAX} characters or fewer.`;
  }
  if (postcode.length > LOCATION_POSTCODE_MAX) {
    fieldErrors.postcode = `Use ${LOCATION_POSTCODE_MAX} characters or fewer.`;
  }
  if (country.length > LOCATION_COUNTRY_MAX) {
    fieldErrors.country = `Use ${LOCATION_COUNTRY_MAX} characters or fewer.`;
  }

  const latitude = parseOptionalCoordinate(raw.latitude, -90, 90, "latitude");
  const longitude = parseOptionalCoordinate(
    raw.longitude,
    -180,
    180,
    "longitude",
  );

  if ("error" in latitude) {
    fieldErrors.latitude = latitude.error;
  }
  if ("error" in longitude) {
    fieldErrors.longitude = longitude.error;
  }

  if (hasLocationFieldErrors(fieldErrors)) {
    return { fieldErrors };
  }

  return {
    data: {
      label,
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      town_city: townCity,
      county_region: countyRegion,
      postcode,
      country,
      latitude: "value" in latitude ? latitude.value : null,
      longitude: "value" in longitude ? longitude.value : null,
    },
  };
}

export function toPublicLocation(location: Location): PublicLocation {
  return {
    label: location.label,
    town_city: location.town_city,
    county_region: location.county_region,
    postcode: location.postcode,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

export const LOCATION_SAVE_FAILED_MESSAGE =
  "The location could not be saved. Please try again.";
