import Image from "next/image";
import type { PublicEntity } from "@/server/entities/types";
import { getEntityLogoPublicUrl } from "@/server/entities/queries";
import { formatConciseLocation } from "@/server/locations/format";

export function ListingEntityBlock({ entity }: { entity: PublicEntity }) {
  const logoUrl = getEntityLogoPublicUrl(entity.logo_path);
  const locationLabel = formatConciseLocation(entity.location);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(26,25,22,0.035)]">
      <h2 className="text-lg font-semibold tracking-tight text-(--public-text)">
        Provided by
      </h2>
      <div className="mt-4 flex gap-4">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <p className="font-medium text-(--brand-primary)">{entity.name}</p>
          {locationLabel ? (
            <p className="mt-1 text-sm text-(--public-text-muted)">{locationLabel}</p>
          ) : null}
          {entity.public_description ? (
            <p className="mt-2 text-sm leading-6 text-(--public-text-muted)">
              {entity.public_description}
            </p>
          ) : null}
        </div>
      </div>
      {entity.email || entity.phone || entity.website_url ? (
        <ul className="mt-4 space-y-1 text-sm text-(--public-text-muted)">
          {entity.email ? <li>{entity.email}</li> : null}
          {entity.phone ? <li>{entity.phone}</li> : null}
          {entity.website_url ? (
            <li>
              <a
                href={entity.website_url}
                className="font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
              >
                {entity.website_url}
              </a>
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}
