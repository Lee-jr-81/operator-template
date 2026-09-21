import type { PublicLocation } from "@/server/locations/types";

export type Entity = {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_website: boolean;
  public_description: string;
  operator_notes: string;
  location_id: string | null;
  created_at: string;
  updated_at: string;
};

export type EntityInput = {
  name: string;
  slug: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_website: boolean;
  public_description: string;
  operator_notes: string;
};

export type PublicEntity = {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  public_description: string;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  location: PublicLocation | null;
};

export type EntityFieldErrors = {
  name?: string;
  slug?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  public_description?: string;
  operator_notes?: string;
  logo?: string;
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
