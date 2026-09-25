import Link from "next/link";
import { statusBannerClass } from "@/components/dashboard/status-banner";

export function DealStatusBanner({ status }: { status?: string }) {
  const message =
    status === "created"
      ? "Deal created."
      : status === "updated"
        ? "Deal updated."
        : status === "deleted"
          ? "Deal deleted."
          : status === "delete-failed"
            ? "The Deal could not be deleted. Please try again."
            : null;

  if (!message) {
    return null;
  }

  const isError = status === "delete-failed";

  return (
    <p
      role="status"
      className={statusBannerClass(isError)}
    >
      {message}
      {status === "created" ? (
        <>
          {" "}
          Copy a promotional post next.
        </>
      ) : null}
    </p>
  );
}

export function DealCreatedPromoteLink({ dealId }: { dealId: string }) {
  return (
    <p className="text-sm">
      <Link
        href={`/dashboard/deals/${dealId}/promote`}
        className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
      >
        Promote Deal
      </Link>
    </p>
  );
}
