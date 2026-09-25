import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEnquiryStatus } from "@/server/enquiries/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatEnquiryReceived } from "@/lib/enquiries/format";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
} from "@/lib/enquiries/status";
import { getEnquiryById } from "@/server/enquiries/queries";

export const metadata: Metadata = {
  title: "Enquiry",
};

function EnquiryStatusBanner({ status }: { status?: string }) {
  if (status === "updated") {
    return (
      <p
        role="status"
        className="rounded-md border border-(--dash-border) bg-(--dash-card) px-3 py-2 text-sm text-(--dash-fg)"
      >
        Enquiry updated.
      </p>
    );
  }

  if (status === "update-failed") {
    return (
      <p
        role="status"
        className="rounded-md border border-(--dash-destructive)/30 bg-(--dash-destructive-bg) px-3 py-2 text-sm text-(--dash-destructive)"
      >
        The Enquiry could not be updated. Please try again.
      </p>
    );
  }

  return null;
}

export default async function EnquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const enquiry = await getEnquiryById(id);

  if (!enquiry) {
    notFound();
  }

  const mailto = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`Your enquiry about ${enquiry.listing_title}`)}`;
  const tel = enquiry.phone
    ? `tel:${enquiry.phone.replace(/[^\d+]/g, "")}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm">
          <Link
            href="/dashboard/enquiries"
            className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
          >
            Back to Enquiries
          </Link>
        </p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-(--dash-fg) lg:text-[28px]">
          Enquiry from {enquiry.name}
        </h1>
      </div>

      <EnquiryStatusBanner status={status} />

      <Card className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-base font-medium">Visitor</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-(--dash-muted-fg)">Name</dt>
              <dd className="font-medium text-(--dash-fg)">{enquiry.name}</dd>
            </div>
            <div>
              <dt className="text-(--dash-muted-fg)">Email</dt>
              <dd>
                <a
                  href={mailto}
                  className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
                >
                  {enquiry.email}
                </a>
              </dd>
            </div>
            {enquiry.phone ? (
              <div>
                <dt className="text-(--dash-muted-fg)">Phone</dt>
                <dd>
                  {tel ? (
                    <a
                      href={tel}
                      className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
                    >
                      {enquiry.phone}
                    </a>
                  ) : (
                    enquiry.phone
                  )}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section>
          <h2 className="text-base font-medium">Enquiry</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-(--dash-muted-fg)">
            {enquiry.message}
          </p>
          <p className="mt-3 text-sm text-(--dash-muted-fg)">
            Received {formatEnquiryReceived(enquiry.created_at)}
          </p>
          <p className="mt-1 text-sm text-(--dash-muted-fg)">
            Status: {ENQUIRY_STATUS_LABELS[enquiry.status]}
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium">Sent to the Entity</h2>
          <p className="mt-3 text-sm leading-6 text-(--dash-muted-fg)">
            This Enquiry is emailed automatically to the Entity. You do not need
            to forward it.
          </p>
          {enquiry.entity_email ? (
            <p className="mt-2 text-sm text-(--dash-fg)">
              Destination: {enquiry.entity_email}
            </p>
          ) : (
            <p className="mt-2 text-sm text-(--dash-muted-fg)">
              No Entity email is stored on this Listing&apos;s Entity.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-base font-medium">Listing</h2>
          <p className="mt-3 text-sm font-medium text-(--dash-fg)">
            {enquiry.listing_title}
          </p>
          <p className="mt-1 text-sm text-(--dash-muted-fg)">
            {enquiry.entity_name}
            <span aria-hidden="true"> · </span>
            {enquiry.category_name}
          </p>
          <p className="mt-3 flex flex-wrap gap-4">
            <Link
              href={`/dashboard/listings/${enquiry.listing_id}`}
              className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
            >
              Open in dashboard
            </Link>
            {enquiry.listing_slug && enquiry.listing_status === "active" ? (
              <Link
                href={`/listings/${enquiry.listing_slug}`}
                className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
              >
                View public Listing
              </Link>
            ) : null}
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium">Update status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {ENQUIRY_STATUSES.map((nextStatus) => (
              <form key={nextStatus} action={updateEnquiryStatus}>
                <input type="hidden" name="id" value={enquiry.id} />
                <input type="hidden" name="status" value={nextStatus} />
                <Button
                  type="submit"
                  variant={
                    enquiry.status === nextStatus ? "primary" : "secondary"
                  }
                  disabled={enquiry.status === nextStatus}
                >
                  Mark {ENQUIRY_STATUS_LABELS[nextStatus]}
                </Button>
              </form>
            ))}
          </div>
        </section>
      </Card>
    </div>
  );
}
