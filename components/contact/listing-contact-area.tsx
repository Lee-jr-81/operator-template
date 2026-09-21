import { WhatsAppButton } from "@/components/contact/whatsapp-button";
import { EnquiryForm } from "@/components/enquiries/enquiry-form";
import {
  hasAnyListingContact,
  type ListingContactChannels,
} from "@/lib/contact/availability";

export function ListingContactArea({
  listingId,
  listingTitle,
  entityName,
  channels,
}: {
  listingId: string;
  listingTitle: string;
  entityName: string;
  channels: ListingContactChannels;
}) {
  if (!hasAnyListingContact(channels)) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-(--public-text)">
          Interested in this listing?
        </h2>
        <p className="mt-2 text-sm leading-6 text-(--public-text-muted)">
          Contact the Provider about this Listing.
        </p>
      </div>

      {channels.whatsappUrl ? (
        <p>
          <WhatsAppButton listingId={listingId} href={channels.whatsappUrl} />
        </p>
      ) : null}

      {channels.canEnquire ? (
        <EnquiryForm
          listingId={listingId}
          listingTitle={listingTitle}
          entityName={entityName}
        />
      ) : null}
    </section>
  );
}
