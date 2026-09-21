import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/deals/copy-button";
import { Card } from "@/components/ui/card";
import { formatDealExpiry } from "@/lib/deals/format";
import {
  generalPromotionCopy,
  shortPromotionCopy,
} from "@/lib/deals/promotion-templates";
import { getPublicListingUrl } from "@/lib/site-url";
import { getDealPromotionContext } from "@/server/deals/queries";

export const metadata: Metadata = {
  title: "Promote Deal",
};

export default async function PromoteDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getDealPromotionContext(id);

  if (!context) {
    notFound();
  }

  const listingUrl = getPublicListingUrl(context.listingSlug);
  const promotionData = listingUrl
    ? {
        headline: context.deal.headline,
        description: context.deal.description,
        listingTitle: context.listingTitle,
        entityName: context.entityName,
        promoCode: context.deal.promo_code,
        expiresLabel: formatDealExpiry(context.deal.expires_at),
        listingUrl,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href={`/dashboard/deals/${context.deal.id}`}
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to Deal
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Promote Deal
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Ready-to-copy posts generated from this Deal. This does not post
          anywhere. Copy the text, then paste and edit it in the channel you
          use.
        </p>
      </div>

      {!promotionData ? (
        <Card className="max-w-3xl">
          <p className="text-sm leading-6 text-(--dash-muted-fg)">
            Set <span className="font-medium">NEXT_PUBLIC_SITE_URL</span> in
            .env.local to the public site origin so promotional copy can
            include the Listing URL.
          </p>
        </Card>
      ) : (
        <div className="grid max-w-3xl gap-6">
          <Card className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-medium">Facebook / general post</h2>
              <CopyButton text={generalPromotionCopy(promotionData)} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-(--dash-muted) p-3 text-sm leading-6 text-(--dash-fg)">
              {generalPromotionCopy(promotionData)}
            </pre>
          </Card>
          <Card className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-medium">Short social post</h2>
              <CopyButton text={shortPromotionCopy(promotionData)} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-(--dash-muted) p-3 text-sm leading-6 text-(--dash-fg)">
              {shortPromotionCopy(promotionData)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}
