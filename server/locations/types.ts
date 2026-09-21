export type Location = {
  id: string;
  label: string;
  address_line_1: string;
  address_line_2: string;
  town_city: string;
  county_region: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type LocationInput = {
  label: string;
  address_line_1: string;
  address_line_2: string;
  town_city: string;
  county_region: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type PublicLocation = {
  label: string;
  town_city: string;
  county_region: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type LocationFieldErrors = {
  label?: string;
  address_line_1?: string;
  address_line_2?: string;
  town_city?: string;
  county_region?: string;
  postcode?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
};
