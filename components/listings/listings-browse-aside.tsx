import Image from "next/image";
import Link from "next/link";
import { BRANDING } from "@/config/branding";
import { TERMINOLOGY } from "@/config/terminology";
import { publicButtonClass } from "@/lib/public-button";
import { mediaZoomClass } from "@/lib/public-layout";

export type BrowseAsideCategory = {
  name: string;
  slug: string;
  imageUrl?: string | null;
};

function CategoryPhoto({
  imageUrl,
  sizes,
}: {
  imageUrl?: string | null;
  sizes: string;
}) {
  return (
    <Image
      src={imageUrl || BRANDING.media.categoryFallback}
      alt=""
      fill
      sizes={sizes}
      className={mediaZoomClass()}
    />
  );
}

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
              <CategoryPhoto imageUrl={featured.imageUrl} sizes="320px" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-[15px] font-semibold leading-tight text-white">
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
                        <CategoryPhoto
                          imageUrl={category.imageUrl}
                          sizes="56px"
                        />
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
            Have something to list?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Add it to this marketplace and reach people looking in this
            specialist market.
          </p>
          <p className="mt-5">
            <Link href="/login" className={publicButtonClass.onBrand}>
              Submit a listing
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
