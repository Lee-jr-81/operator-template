import Link from "next/link";
import { statusBannerClass } from "@/components/dashboard/status-banner";

export function EntityStatusBanner({ status }: { status?: string }) {
  const message =
    status === "created"
      ? "Entity created."
      : status === "updated"
        ? "Entity updated."
        : status === "deleted"
          ? "Entity deleted."
          : status === "in-use"
            ? "This Entity still has Listings. Move or delete those Listings first."
            : status === "delete-failed"
            ? "The Entity could not be deleted. Please try again."
            : status === "created-logo-failed"
              ? "Entity created, but the logo could not be uploaded. You can add it here."
              : status === "created-location-failed"
                ? "Entity created, but the location could not be saved. You can add it here."
                : null;

  if (!message) {
    return null;
  }

  const isError =
    status === "delete-failed" ||
    status === "created-logo-failed" ||
    status === "created-location-failed" ||
    status === "in-use";

  return (
    <p
      role="status"
      className={statusBannerClass(isError)}
    >
      {message}
      {status === "in-use" ? (
        <>
          {" "}
          <Link
            href="/dashboard/listings"
            className="font-medium underline-offset-4 hover:underline"
          >
            View Listings
          </Link>
        </>
      ) : null}
    </p>
  );
}
