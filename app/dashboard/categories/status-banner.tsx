import Link from "next/link";
import { statusBannerClass } from "@/components/dashboard/status-banner";

export function CategoryStatusBanner({ status }: { status?: string }) {
  const message =
    status === "created"
      ? "Category created."
      : status === "updated"
        ? "Category updated."
        : status === "deleted"
          ? "Category deleted."
          : status === "in-use"
            ? "This Category still has Listings. Move or delete those Listings first."
            : status === "delete-failed"
            ? "The Category could not be deleted. Please try again."
            : null;

  if (!message) {
    return null;
  }

  const isError = status === "delete-failed" || status === "in-use";

  return (
    <p role="status" className={statusBannerClass(isError)}>
      {message}{" "}
      {status === "created" || status === "updated" ? (
        <Link href="/categories" className="font-medium underline-offset-4 hover:underline">
          View public Categories
        </Link>
      ) : null}
      {status === "in-use" ? (
        <Link
          href="/dashboard/listings"
          className="font-medium underline-offset-4 hover:underline"
        >
          View Listings
        </Link>
      ) : null}
    </p>
  );
}
