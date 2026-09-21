import { cn } from "@/lib/cn";

export function ListingImageFallback({
  label = "No image yet",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex aspect-4/3 items-center justify-center bg-slate-100 text-sm text-slate-500",
        className,
      )}
    >
      {label}
    </div>
  );
}
