export const VERTICAL_LABEL =
  "Starter listing_details fields — replace these when cloning a niche.";

export const SERVICE_FORMAT_MAX = 80;
export const PRICE_TEXT_MAX = 80;
export const DURATION_TEXT_MAX = 80;

export type ListingDetailsInput = {
  service_format: string;
  price_text: string;
  duration_text: string;
};

export type ListingDetailsFieldErrors = {
  service_format?: string;
  price_text?: string;
  duration_text?: string;
};
