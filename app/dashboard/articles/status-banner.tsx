import Link from "next/link";
import { statusBannerClass } from "@/components/dashboard/status-banner";

export function ArticleStatusBanner({
  status,
  articleId,
}: {
  status?: string;
  articleId?: string;
}) {
  const message =
    status === "created"
      ? "Article created. Review the Markdown, add a hero image if you want one, then publish when it is ready."
      : status === "updated"
        ? "Article updated."
        : status === "published"
          ? "Article published."
          : status === "drafted"
            ? "Article returned to Draft."
            : status === "deleted"
              ? "Article deleted."
              : status === "delete-failed"
                ? "The Article could not be deleted. Please try again."
                : status === "hero-updated"
                  ? "Hero image updated."
                  : status === "hero-removed"
                    ? "Hero image removed."
                    : status === "hero-failed"
                      ? "The hero image could not be updated. Please try again."
                      : status === "listing-added"
                        ? "Listing added to Article."
                        : status === "listing-removed"
                          ? "Listing removed from Article."
                          : status === "listings-updated"
                            ? "Related Listings updated."
                            : status === "listing-already-related"
                              ? "That Listing is already linked to this Article."
                              : status === "listing-add-failed"
                                ? "That Listing could not be added. Please try again."
                                : status === "listing-remove-failed"
                                  ? "That Listing could not be removed. Please try again."
                                  : status === "listing-move-failed"
                                    ? "Related Listings could not be reordered. Please try again."
                                    : null;

  if (!message) {
    return null;
  }

  const isError =
    status === "delete-failed" ||
    status === "hero-failed" ||
    status === "listing-already-related" ||
    status === "listing-add-failed" ||
    status === "listing-remove-failed" ||
    status === "listing-move-failed";

  return (
    <p
      role="status"
      className={statusBannerClass(isError)}
    >
      {message}
      {status === "published" ? (
        <>
          {" "}
          <Link
            href="/articles"
            className="font-medium underline-offset-4 hover:underline"
          >
            View public Articles
          </Link>
          {articleId ? (
            <>
              {" "}
              <Link
                href={`/dashboard/articles/${articleId}/promote`}
                className="font-medium underline-offset-4 hover:underline"
              >
                Promote Article
              </Link>
            </>
          ) : null}
        </>
      ) : null}
    </p>
  );
}
