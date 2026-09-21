import type { Metadata } from "next";
import Link from "next/link";
import { DealStatusBanner } from "@/app/dashboard/deals/status-banner";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonClass } from "@/components/ui/button";
import { DEAL_STATE_LABELS, getDealState } from "@/lib/deals/current";
import { formatDealDateTime } from "@/lib/deals/format";
import {
  dashDangerLink,
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import {
  listDealListingOptions,
  listOperatorDeals,
} from "@/server/deals/queries";

export const metadata: Metadata = {
  title: "Deals",
};

function dealTone(state: ReturnType<typeof getDealState>) {
  if (state === "live") {
    return "success" as const;
  }
  if (state === "scheduled") {
    return "warning" as const;
  }
  return "muted" as const;
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [deals, listings] = await Promise.all([
    listOperatorDeals(),
    listDealListingOptions(),
  ]);
  const canCreate = listings.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Deals"
        description="Temporary offers attached to Listings."
        action={
          canCreate ? (
            <Link href="/dashboard/deals/new" className={buttonClass.primary}>
              Create Deal
            </Link>
          ) : null
        }
      />

      <DealStatusBanner status={status} />

      {deals.length === 0 ? (
        <EmptyState title="No Deals yet">
          {!canCreate ? (
            <>
              <p>A Deal belongs to a Listing. Create a Listing first.</p>
              <p>
                <Link href="/dashboard/listings/new" className={dashLink}>
                  Create a Listing
                </Link>
              </p>
            </>
          ) : (
            <>
              <p>
                Work with an Entity to source an offer, then attach it to one of
                their Listings.
              </p>
              <p>
                <Link href="/dashboard/deals/new" className={dashLink}>
                  Create first Deal
                </Link>
              </p>
            </>
          )}
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Deal</DataTableHeaderCell>
              <DataTableHeaderCell>Listing</DataTableHeaderCell>
              <DataTableHeaderCell>Entity</DataTableHeaderCell>
              <DataTableHeaderCell>State</DataTableHeaderCell>
              <DataTableHeaderCell>Expires</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {deals.map((deal) => {
              const state = getDealState(deal);
              return (
                <tr key={deal.id} className={dashTr}>
                  <td className={`${dashTd} font-medium`}>{deal.headline}</td>
                  <td className={`${dashTd} text-(--dash-muted-fg)`}>
                    {deal.listing_title}
                  </td>
                  <td className={`${dashTd} text-(--dash-muted-fg)`}>
                    {deal.entity_name}
                  </td>
                  <td className={dashTd}>
                    <StatusBadge tone={dealTone(state)}>
                      {DEAL_STATE_LABELS[state]}
                    </StatusBadge>
                  </td>
                  <td className={`${dashTd} text-(--dash-muted-fg)`}>
                    {formatDealDateTime(deal.expires_at)}
                  </td>
                  <td className={`${dashTd} text-right`}>
                    <div className="flex flex-wrap justify-end gap-3">
                      <Link
                        href={`/dashboard/deals/${deal.id}`}
                        className={dashLink}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/deals/${deal.id}/promote`}
                        className={dashLink}
                      >
                        Promote
                      </Link>
                      <Link
                        href={`/dashboard/deals/${deal.id}/delete`}
                        className={dashDangerLink}
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
