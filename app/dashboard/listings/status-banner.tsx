import Link from "next/link";
import { statusBannerClass } from "@/components/dashboard/status-banner";

export function ListingStatusBanner({ status }: { status?: string }) {
  const message =
    status === "created"
      ? "Listing created. Add images below, then activate it when it is ready."
      : status === "updated"
        ? "Listing updated."
        : status === "duplicated"
          ? "Listing duplicated. Review the copied details, add the correct images, and activate the Listing when it is ready. Images were not copied."
          : status === "duplicate-failed"
            ? "The Listing could not be duplicated. Please try again."
            : status === "deleted"
              ? "Listing deleted."
              : status === "delete-failed"
                ? "The Listing could not be deleted. Please try again."
                : status === "has-enquiries"
                  ? "This Listing has Enquiries, so it cannot be deleted. The lead history is kept. Mark the Listing inactive instead."
                : status === "media-added"
                  ? "Image uploaded."
                  : status === "media-updated"
                    ? "Images updated."
                    : status === "media-removed"
                      ? "Image removed."
                      : status === "media-failed"
                        ? "The image could not be updated. Please try again."
                        : null;

  if (!message) {
    return null;
  }

  const isError =
    status === "delete-failed" ||
    status === "has-enquiries" ||
    status === "duplicate-failed" ||
    status === "media-failed";

  return (
    <p
      role="status"
      className={statusBannerClass(isError)}
    >
      {message}
      {status === "updated" ? (
        <>
          {" "}
          <Link
            href="/listings"
            className="font-medium underline-offset-4 hover:underline"
          >
            View public Listings
          </Link>
        </>
      ) : null}
    </p>
  );
}
