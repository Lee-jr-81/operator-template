import type { Metadata } from "next";
import Link from "next/link";
import {
  DataTable,
  DataTableHead,
  DataTableHeaderCell,
} from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { cn } from "@/lib/cn";
import {
  dashLink,
  dashTd,
  dashTr,
} from "@/lib/dashboard/classes";
import { formatEnquiryReceived } from "@/lib/enquiries/format";
import { ENQUIRY_STATUS_LABELS } from "@/lib/enquiries/status";
import { listOperatorEnquiries } from "@/server/enquiries/queries";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default async function EnquiriesPage() {
  const enquiries = await listOperatorEnquiries();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Enquiries"
        description="Stored here and emailed to the Entity. Review them; the conversation happens off the platform."
      />

      {enquiries.length === 0 ? (
        <EmptyState title="No enquiries yet">
          <p>Enquiries from public Listings appear here.</p>
        </EmptyState>
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Visitor</DataTableHeaderCell>
              <DataTableHeaderCell>Listing</DataTableHeaderCell>
              <DataTableHeaderCell>Entity</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Received</DataTableHeaderCell>
              <DataTableHeaderCell className="text-right">
                Actions
              </DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr
                key={enquiry.id}
                className={cn(
                  dashTr,
                  enquiry.status === "new" && "bg-(--dash-info-bg)/40",
                )}
              >
                <td
                  className={cn(
                    dashTd,
                    enquiry.status === "new" && "font-semibold",
                  )}
                >
                  {enquiry.name}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {enquiry.listing_title}
                </td>
                <td className={`${dashTd} text-(--dash-muted-fg)`}>
                  {enquiry.entity_name}
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
                <td className={`${dashTd} text-right`}>
                  <Link
                    href={`/dashboard/enquiries/${enquiry.id}`}
                    className={dashLink}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
