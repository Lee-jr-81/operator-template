import Link from "next/link";
import { CategoryImage } from "@/components/categories/category-image";
import { TERMINOLOGY } from "@/config/terminology";
import { cn } from "@/lib/cn";
import { publicButtonClass } from "@/lib/public-button";

export type BrowseAsideCategory = {
  name: string;
  slug: string;
  imageUrl?: string | null;
};

export function ListingsBrowseAside({
  categories,
}: {
  categories: BrowseAsideCategory[];
}) {
  const [featured, ...rest] = categories;

  return (
    <aside className="hidden lg:block">
      <div className="space-y-4 lg:sticky lg:top-24">
        {featured ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(26,25,22,0.035)]">
            <div className="h-1 bg-(--brand-primary)" />
            <div className="px-4 pb-4 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--public-text-subtle)">
                Browse by
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-(--public-text)">
                {TERMINOLOGY.category.singular}
              </h2>
            </div>
            <Link
              href={`/categories/${featured.slug}`}
              aria-label={featured.name}
              className="group relative mx-4 mb-3 block aspect-5/3 overflow-hidden rounded-xl"
            >
              <CategoryImage
                imageUrl={featured.imageUrl}
                sizes="320px"
                clearTitle
              />
              <span
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 text-[15px] font-semibold leading-tight",
                  featured.imageUrl
                    ? "bg-linear-to-t from-black/70 to-transparent text-white"
                    : "text-(--public-text)",
                )}
              >
                {featured.name}
              </span>
            </Link>
            {rest.length > 0 ? (
              <ul className="border-t border-(--public-border) px-2 py-2">
                {rest.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="group flex items-center gap-3 rounded-xl p-2 transition duration-200 hover:bg-(--public-muted)"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                        <CategoryImage imageUrl={category.imageUrl} sizes="56px" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--public-text) transition duration-200 group-hover:text-(--brand-primary)">
                        {category.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-(--public-text-subtle) transition duration-200 group-hover:translate-x-0.5 group-hover:text-(--brand-primary)"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className="rounded-2xl bg-(--brand-primary) px-5 py-6 text-white">
          <p className="text-base font-semibold tracking-tight">
            Are you a {TERMINOLOGY.entity.singular.toLowerCase()}?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Tell us about your {TERMINOLOGY.listing.plural.toLowerCase()} and we
            will be in touch.
          </p>
          <p className="mt-5">
            <Link href="/contact" className={publicButtonClass.onBrand}>
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
