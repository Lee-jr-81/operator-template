import { BUSINESS } from "@/config/business";
import type { ListingDetailsInput } from "@/lib/listings/vertical";

export function formatCardPrice(price: string) {
  const prefix = BUSINESS.locale.currencyPrefix;
  if (!price || !prefix || price.startsWith(prefix)) {
    return price;
  }

  return `${prefix}${price}`;
}

export function VerticalCardMeta({ details }: { details: ListingDetailsInput }) {
  const price = formatCardPrice(details.price_text.trim());
  const duration = details.duration_text.trim();

  if (!price && !duration) {
    return null;
  }

  return (
    <dl className="mt-2 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <dt className="sr-only">Price</dt>
        <dd className="truncate text-[26px] font-bold leading-none text-(--public-text)">
          {price || "\u00a0"}
        </dd>
      </div>
      {duration ? (
        <div className="min-w-0 shrink-0 text-right">
          <dt className="sr-only">Duration</dt>
          <dd className="truncate text-[18px] leading-none text-(--public-text-muted)">
            {duration}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
