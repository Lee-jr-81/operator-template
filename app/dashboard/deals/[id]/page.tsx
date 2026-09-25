import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealForm } from "@/app/dashboard/deals/deal-form";
import {
  DealCreatedPromoteLink,
  DealStatusBanner,
} from "@/app/dashboard/deals/status-banner";
import { Card } from "@/components/ui/card";
import {
  getDealById,
  listDealListingOptions,
} from "@/server/deals/queries";

export const metadata: Metadata = {
  title: "Edit Deal",
};

export default async function EditDealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const [deal, listings] = await Promise.all([
    getDealById(id),
    listDealListingOptions(),
  ]);

  if (!deal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/deals"
            className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Back to Deals
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Edit Deal
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Changing dates or turning the Deal inactive updates public
          visibility immediately. No extra publish step is required.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link
            href={`/dashboard/deals/${deal.id}/promote`}
            className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Promote Deal
          </Link>
          <Link
            href={`/dashboard/deals/${deal.id}/delete`}
            className="text-sm font-medium text-(--dash-destructive) underline-offset-4 hover:underline"
          >
            Delete Deal
          </Link>
        </div>
      </div>
      <DealStatusBanner status={status} />
      {status === "created" ? (
        <DealCreatedPromoteLink dealId={deal.id} />
      ) : null}
      <Card className="max-w-3xl">
        <DealForm deal={deal} listings={listings} />
      </Card>
    </div>
  );
}
