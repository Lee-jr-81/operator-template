import type { Metadata } from "next";
import Link from "next/link";
import { DealForm } from "@/app/dashboard/deals/deal-form";
import { Card } from "@/components/ui/card";
import { listDealListingOptions } from "@/server/deals/queries";

export const metadata: Metadata = {
  title: "Create Deal",
};

export default async function NewDealPage() {
  const listings = await listDealListingOptions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/deals"
            className="font-medium text-(--dash-muted-fg) underline-offset-4 hover:underline"
          >
            Back to Deals
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Create Deal
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--dash-muted-fg)">
          Source an offer from an Entity, attach it to one of their Listings,
          then copy promotional text to share it.
        </p>
      </div>

      {listings.length === 0 ? (
        <Card className="max-w-3xl space-y-3">
          <h2 className="text-base font-medium">Create a Listing first</h2>
          <p className="text-sm leading-6 text-(--dash-muted-fg)">
            Every Deal belongs to one Listing. The form is hidden until a
            Listing exists so you do not submit incomplete data.
          </p>
          <p>
            <Link
              href="/dashboard/listings/new"
              className="text-sm font-medium text-(--dash-fg) underline-offset-4 hover:underline"
            >
              Create a Listing
            </Link>
          </p>
        </Card>
      ) : (
        <Card className="max-w-3xl">
          <DealForm listings={listings} />
        </Card>
      )}
    </div>
  );
}
