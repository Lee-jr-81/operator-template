import Image from "next/image";
import Link from "next/link";
import { BRANDING } from "@/config/branding";
import { mediaZoomClass } from "@/lib/public-layout";

export function CategoryCard({
  name,
  slug,
  imageUrl,
}: {
  name: string;
  slug: string;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={`/categories/${slug}`}
      aria-label={name}
      className="group relative block aspect-square overflow-hidden rounded-(--radius-card)"
    >
      <Image
        src={imageUrl || BRANDING.media.categoryFallback}
        alt=""
        fill
        sizes="(min-width: 1024px) 148px, (min-width: 640px) 29vw, 58vw"
        className={mediaZoomClass()}
      />
      <h3 className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 pb-3 pt-10 text-base font-semibold leading-tight text-white transition duration-200 motion-safe:group-hover:translate-x-0.5">
        {name}
      </h3>
    </Link>
  );
}
