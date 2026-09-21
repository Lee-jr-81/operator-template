export type DealState = "live" | "scheduled" | "expired" | "inactive";

export type DealLifecycleFields = {
  is_active: boolean;
  starts_at: string | null;
  expires_at: string;
};

export const DEAL_STATE_LABELS: Record<DealState, string> = {
  live: "Live",
  scheduled: "Scheduled",
  expired: "Expired",
  inactive: "Inactive",
};

function startTime(startsAt: string | null) {
  return startsAt ? new Date(startsAt).getTime() : Number.NEGATIVE_INFINITY;
}

function expiryTime(expiresAt: string) {
  return new Date(expiresAt).getTime();
}

export function getDealState(
  deal: DealLifecycleFields,
  now: Date = new Date(),
): DealState {
  if (!deal.is_active) {
    return "inactive";
  }

  const nowMs = now.getTime();

  if (expiryTime(deal.expires_at) <= nowMs) {
    return "expired";
  }

  if (startTime(deal.starts_at) > nowMs) {
    return "scheduled";
  }

  return "live";
}

export function isCurrentDeal(
  deal: DealLifecycleFields,
  now: Date = new Date(),
) {
  return getDealState(deal, now) === "live";
}

export function isPubliclyVisibleDeal(
  deal: DealLifecycleFields,
  listingStatus: string,
  now: Date = new Date(),
) {
  return listingStatus === "active" && isCurrentDeal(deal, now);
}

export function dealWindowsOverlap(
  a: Pick<DealLifecycleFields, "starts_at" | "expires_at">,
  b: Pick<DealLifecycleFields, "starts_at" | "expires_at">,
) {
  return startTime(a.starts_at) < expiryTime(b.expires_at) &&
    startTime(b.starts_at) < expiryTime(a.expires_at);
}

export function selectCurrentDeal<T extends DealLifecycleFields>(
  deals: T[],
  now: Date = new Date(),
) {
  const current = deals
    .filter((deal) => isCurrentDeal(deal, now))
    .sort(
      (a, b) => expiryTime(a.expires_at) - expiryTime(b.expires_at),
    );

  return current[0] ?? null;
}
