import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";
import { publicButtonClass } from "@/lib/public-button";

export function HomepageHero() {
  return (
    <section className="pt-4 sm:pt-6">
      <Container>
        <div className="relative isolate h-130 overflow-hidden rounded-2xl lg:h-155">
          <Image
            src={BRANDING.media.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
            <h1 className="max-w-2xl text-[38px] font-bold leading-[1.05] tracking-tight text-white sm:text-[46px] lg:text-[56px]">
              {BUSINESS.tagline}
            </h1>
            <p className="mt-6">
              <Link href="/listings" className={publicButtonClass.heroPrimary}>
                Browse {TERMINOLOGY.listing.plural}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
