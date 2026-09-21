import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDeal } from "@/server/deals/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDealById } from "@/server/deals/queries";

export const metadata: Metadata = {
  title: "Delete Deal",
};

export default async function DeleteDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

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
          Delete Deal
        </h1>
      </div>
      <Card className="max-w-3xl space-y-4">
        <p className="text-sm leading-6 text-(--dash-muted-fg)">
          Delete <span className="font-semibold">{deal.headline}</span>? This
          cannot be undone. The Listing stays in place.
        </p>
        <form action={deleteDeal} className="flex flex-wrap gap-3">
          <input type="hidden" name="id" value={deal.id} />
          <Button type="submit" variant="danger">
            Delete {deal.headline}
          </Button>
          <Link
            href="/dashboard/deals"
            className="inline-flex h-[42px] items-center justify-center rounded-[8px] border border-(--dash-border) bg-(--dash-card) px-3.5 text-sm font-semibold text-(--dash-fg) hover:bg-(--dash-muted)"
          >
            Cancel
          </Link>
        </form>
      </Card>
    </div>
  );
}
