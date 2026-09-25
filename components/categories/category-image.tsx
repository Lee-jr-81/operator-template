import Image from "next/image";
import { BRANDING } from "@/config/branding";
import { cn } from "@/lib/cn";
import { mediaZoomClass } from "@/lib/public-layout";

export function CategoryImage({
  imageUrl,
  sizes,
  clearTitle = false,
}: {
  imageUrl?: string | null;
  sizes: string;
  clearTitle?: boolean;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes={sizes}
        className={mediaZoomClass()}
      />
    );
  }

  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-(--public-muted)",
        clearTitle && "pb-8",
      )}
    >
      <img
        src={BRANDING.media.categoryIcon}
        alt=""
        className="h-[36%] max-h-16 w-auto max-w-[46%] object-contain"
      />
    </span>
  );
}
