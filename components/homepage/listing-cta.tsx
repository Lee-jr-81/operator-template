import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BUSINESS } from "@/config/business";
import { publicButtonClass } from "@/lib/public-button";

export function HomepageListingCta() {
  return (
    <Container className="pb-14 sm:pb-18 lg:pb-24">
      <section className="rounded-2xl bg-(--brand-primary) px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="text-[28px] font-bold tracking-tight text-white lg:text-[32px]">
          Have something to{" "}
          <span className="underline decoration-2 decoration-white underline-offset-[0.24em]">
            list
          </span>
          ?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
          Add your business, service, product or opportunity to {BUSINESS.name}{" "}
          and reach people looking in this specialist market.
        </p>
        <p className="mt-8">
          <Link href="/login" className={publicButtonClass.onBrand}>
            Submit a listing
          </Link>
        </p>
      </section>
    </Container>
  );
}
