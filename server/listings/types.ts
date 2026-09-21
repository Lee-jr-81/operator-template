import type { ListingStatus } from "@/server/listings/status";
import type { ListingDetailsInput } from "@/lib/listings/vertical";

export type Listing = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category_id: string;
  entity_id: string;
  status: ListingStatus;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

export type ListingInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category_id: string;
  entity_id: string;
  status: ListingStatus;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

export type ListingListItem = {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  updated_at: string;
  category_name: string;
  entity_name: string;
};

export type PublicListingCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category_name: string;
  category_slug: string;
  entity_name: string;
  details: ListingDetailsInput;
  image: {
    url: string;
    alt: string;
  } | null;
  entity_location: string | null;
  created_at: string;
  current_deal: {
    id: string;
    headline: string;
  } | null;
};

export type ListingFieldErrors = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  category_id?: string;
  entity_id?: string;
  status?: string;
  seo_title?: string;
  seo_description?: string;
};
