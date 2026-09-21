import { duplicateListing } from "@/server/listings/actions";

export function DuplicateListingButton({
  listingId,
  className,
}: {
  listingId: string;
  className?: string;
}) {
  return (
    <form action={duplicateListing}>
      <input type="hidden" name="id" value={listingId} />
      <button type="submit" className={className}>
        Duplicate
      </button>
    </form>
  );
}
