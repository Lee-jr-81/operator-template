import { ListingContactArea } from "@/components/contact/listing-contact-area";
import { DealPanel } from "@/components/deals/deal-panel";
import { formatCardPrice } from "@/components/listings/vertical-card";
import { hasAnyListingContact } from "@/lib/contact/availability";
import type { ListingContactChannels } from "@/lib/contact/availability";
import type { ListingDetailsInput } from "@/lib/listings/vertical";
import type { PublicDeal } from "@/server/deals/types";

export function hasListingEnquireContent(input: {
  details: ListingDetailsInput;
  currentDeal: PublicDeal | null;
  channels: ListingContactChannels;
}) {
  const price = formatCardPrice(input.details.price_text.trim());
  const duration = input.details.duration_text.trim();

  return Boolean(
    price || duration || input.currentDeal || hasAnyListingContact(input.channels),
  );
}

export function ListingEnquirePanel({
  details,
  currentDeal,
  listingId,
  listingTitle,
  entityName,
  channels,
}: {
  details: ListingDetailsInput;
  currentDeal: PublicDeal | null;
  listingId: string;
  listingTitle: string;
  entityName: string;
  channels: ListingContactChannels;
}) {
  const price = formatCardPrice(details.price_text.trim());
  const duration = details.duration_text.trim();
  const canContact = hasAnyListingContact(channels);

  if (!hasListingEnquireContent({ details, currentDeal, channels })) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(26,25,22,0.035)] lg:sticky lg:top-24">
      {price || duration ? (
        <div className="flex items-end justify-between gap-3">
          {price ? (
            <p className="text-[26px] font-bold leading-none text-(--public-text)">
              {price}
            </p>
          ) : null}
          {duration ? (
            <p className="text-[18px] leading-none text-(--public-text-muted)">
              {duration}
            </p>
          ) : null}
        </div>
      ) : null}
      {currentDeal ? (
        <div className={price || duration ? "mt-5" : undefined}>
          <DealPanel deal={currentDeal} />
        </div>
      ) : null}
      {canContact ? (
        <div className={price || duration || currentDeal ? "mt-6" : undefined}>
          <ListingContactArea
            listingId={listingId}
            listingTitle={listingTitle}
            entityName={entityName}
            channels={channels}
          />
        </div>
      ) : null}
    </div>
  );
}
