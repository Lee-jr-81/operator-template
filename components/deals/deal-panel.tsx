import { formatDealExpiry } from "@/lib/deals/format";
import type { PublicDeal } from "@/server/deals/types";

export function DealPanel({ deal }: { deal: PublicDeal }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
        Special offer
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
        {deal.headline}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {deal.description}
      </p>
      {deal.promo_code ? (
        <p className="mt-4 text-sm text-slate-800">
          Quote{" "}
          <span className="font-semibold tracking-wide">{deal.promo_code}</span>{" "}
          when booking.
        </p>
      ) : null}
      <p className="mt-3 text-sm text-slate-600">
        Expires {formatDealExpiry(deal.expires_at)}
      </p>
    </div>
  );
}
