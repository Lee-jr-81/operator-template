import Link from "next/link";
import { CoverImage } from "@/components/media/cover-image";
import { formatArticlePublishedDate } from "@/lib/articles/format";
import { cn } from "@/lib/cn";
import { mediaZoomClass } from "@/lib/public-layout";
import type { PublicArticleCard } from "@/server/articles/types";

export function ArticleCard({
  article,
  layout = "compact",
}: {
  article: PublicArticleCard;
  layout?: "compact" | "browse";
}) {
  const isBrowse = layout === "browse";

  return (
    <article
      className={cn("h-full w-full", !isBrowse && "mx-auto max-w-[320px]")}
    >
      <Link
        href={`/articles/${article.slug}`}
        aria-label={article.title}
        className={cn(
          "group flex h-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(26,25,22,0.035)] transition duration-200",
          isBrowse ? "flex-col md:h-95 md:flex-row" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-neutral-50",
            isBrowse
              ? "aspect-3/2 w-full md:h-full md:w-[60%] md:aspect-auto"
              : "aspect-3/2",
          )}
        >
          {article.hero_image_url ? (
            <CoverImage
              src={article.hero_image_url}
              alt=""
              sizes={
                isBrowse
                  ? "(max-width: 768px) 100vw, 60vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className={mediaZoomClass()}
              focalX={article.hero_focal_x}
              focalY={article.hero_focal_y}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-(--public-text-subtle)">
              No image yet
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col px-4 pb-4 pt-2",
            isBrowse && "w-full md:w-[40%] md:px-6 md:pt-6",
          )}
        >
          <h2 className="text-[20px] font-semibold leading-tight tracking-tight text-(--public-text) transition duration-200 group-hover:text-(--brand-primary)">
            <span className="line-clamp-2">{article.title}</span>
          </h2>
          {article.excerpt.trim() ? (
            <p
              className={cn(
                "mt-2 min-w-0 text-[14px] leading-[1.45] text-(--public-text-muted)",
                isBrowse ? "line-clamp-2" : "truncate",
              )}
            >
              {article.excerpt}
            </p>
          ) : null}
          <p className="mt-auto pt-3 text-xs text-(--public-text-muted)">
            {formatArticlePublishedDate(article.published_at)}
          </p>
        </div>
      </Link>
    </article>
  );
}
