export const LISTING_STATUSES = ["active", "inactive"] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export function isListingStatus(value: string): value is ListingStatus {
  return LISTING_STATUSES.includes(value as ListingStatus);
}

export function asListingStatus(value: string): ListingStatus {
  return isListingStatus(value) ? value : "inactive";
}

export function isPubliclyVisibleListing(status: string) {
  return status === "active";
}
