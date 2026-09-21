import { formatCardPrice } from "@/components/listings/vertical-card";
import type { ListingDetailsInput } from "@/lib/listings/vertical";
import { VERTICAL_LABEL } from "@/lib/listings/vertical";

export function VerticalDetail({ details }: { details: ListingDetailsInput }) {
  const rows = [
    { label: "Service format", value: details.service_format },
    { label: "Price", value: formatCardPrice(details.price_text) },
    { label: "Duration", value: details.duration_text },
  ].filter((row) => row.value);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-(--public-text)">
        Details
      </h2>
      <p className="sr-only">{VERTICAL_LABEL}</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-sm font-medium text-(--public-text-muted)">{row.label}</dt>
            <dd className="mt-1 text-sm text-(--public-text)">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
