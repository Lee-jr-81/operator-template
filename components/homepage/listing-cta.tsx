import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";
import { publicButtonClass } from "@/lib/public-button";

export function HomepageListingCta() {
  const entity = TERMINOLOGY.entity.singular.toLowerCase();
  const entities = TERMINOLOGY.entity.plural.toLowerCase();
  const listings = TERMINOLOGY.listing.plural.toLowerCase();

  return (
    <Container className="pb-14 sm:pb-18 lg:pb-24">
      <section className="rounded-2xl bg-(--brand-primary) px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="text-[28px] font-bold tracking-tight text-white lg:text-[32px]">
          Are you a{" "}
          <span className="underline decoration-2 decoration-white underline-offset-[0.24em]">
            {entity}
          </span>
          ?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
          {BUSINESS.name} lists {listings} from {entities}. Tell us about yours
          and we will be in touch.
        </p>
        <p className="mt-8">
          <Link href="/contact" className={publicButtonClass.onBrand}>
            Get in touch
          </Link>
        </p>
      </section>
    </Container>
  );
}
