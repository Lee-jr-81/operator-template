import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { TERMINOLOGY } from "@/config/terminology";
import {
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import { formatEnquiryReceived } from "@/lib/enquiries/format";
import { ENQUIRY_STATUS_LABELS } from "@/lib/enquiries/status";
import { requireOperator } from "@/lib/auth/operator";
import { countWhatsAppClicks } from "@/server/contact/queries";
import { countNewEnquiries, listOperatorEnquiries } from "@/server/enquiries/queries";
import { countEntities } from "@/server/entities/queries";
import { countOperatorListings } from "@/server/listings/queries";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const claims = await requireOperator();
  const email =
    typeof claims.email === "string" ? claims.email : "operator account";
  const [listingCount, entityCount, newEnquiryCount, whatsappClicks, enquiries] =
    await Promise.all([
      countOperatorListings(),
      countEntities(),
      countNewEnquiries(),
      countWhatsAppClicks(),
      listOperatorEnquiries(),
    ]);
  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Signed in as ${email}.`}
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={TERMINOLOGY.listing.plural}
          value={listingCount}
          href="/dashboard/listings"
        />
        <MetricCard
          label={TERMINOLOGY.entity.plural}
          value={entityCount}
          href="/dashboard/entities"
        />
        <MetricCard
          label="New enquiries"
          value={newEnquiryCount}
          hint={
            newEnquiryCount === 0
              ? "Nothing waiting"
              : newEnquiryCount === 1
                ? "1 to review"
                : `${newEnquiryCount} to review`
          }
          href="/dashboard/enquiries"
        />
        <MetricCard
          label="WhatsApp clicks"
          value={whatsappClicks}
        />
      </section>

      {recentEnquiries.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-(--dash-fg)">
              Recent enquiries
            </h2>
            <Link href="/dashboard/enquiries" className={`${dashLink} text-sm`}>
              View all
            </Link>
          </div>
          <DataTable>
            <DataTableHead>
              <tr>
                <DataTableHeaderCell>Visitor</DataTableHeaderCell>
                <DataTableHeaderCell>Listing</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Received</DataTableHeaderCell>
              </tr>
            </DataTableHead>
            <tbody>
              {recentEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className={dashTr}>
                  <td className={dashTd}>
                    <Link
                      href={`/dashboard/enquiries/${enquiry.id}`}
                      className={
                        enquiry.status === "new"
                          ? "font-semibold hover:underline"
                          : "hover:underline"
                      }
                    >
                      {enquiry.name}
                    </Link>
                  </td>
                  <td className={`${dashTd} text-(--dash-muted-fg)`}>
                    {enquiry.listing_title}
                  </td>
                  <td className={dashTd}>
                    <StatusBadge
                      tone={enquiry.status === "new" ? "info" : "muted"}
                    >
                      {ENQUIRY_STATUS_LABELS[enquiry.status]}
                    </StatusBadge>
                  </td>
                  <td className={`${dashTd} text-(--dash-muted-fg)`}>
                    {formatEnquiryReceived(enquiry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </section>
      ) : null}

      {listingCount === 0 || entityCount === 0 ? (
        <Card>
          <h2 className="text-base font-semibold text-(--dash-fg)">
            Build the supply side
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--dash-muted-fg)">
            Add Categories, then Entities, then Listings. Deals attach to
            Listings once they exist.
          </p>
          <p className="mt-4 flex flex-wrap gap-4">
            <Link href="/dashboard/categories" className={dashLink}>
              {TERMINOLOGY.category.plural}
            </Link>
            <Link href="/dashboard/entities" className={dashLink}>
              {TERMINOLOGY.entity.plural}
            </Link>
            <Link href="/dashboard/listings" className={dashLink}>
              {TERMINOLOGY.listing.plural}
            </Link>
          </p>
        </Card>
      ) : null}
    </div>
  );
}
