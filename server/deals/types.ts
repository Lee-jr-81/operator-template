export type Deal = {
  id: string;
  listing_id: string;
  headline: string;
  description: string;
  promo_code: string | null;
  starts_at: string | null;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DealInput = {
  listing_id: string;
  headline: string;
  description: string;
  promo_code: string | null;
  starts_at: string | null;
  expires_at: string;
  is_active: boolean;
};

export type DealListItem = Deal & {
  listing_title: string;
  entity_name: string;
};

export type PublicDeal = {
  id: string;
  headline: string;
  description: string;
  promo_code: string | null;
  starts_at: string | null;
  expires_at: string;
};

export type DealListingOption = {
  id: string;
  title: string;
  status: string;
  category_name: string;
  entity_name: string;
};

export type DealFieldErrors = {
  listing_id?: string;
  headline?: string;
  description?: string;
  promo_code?: string;
  starts_at?: string;
  expires_at?: string;
  is_active?: string;
};
