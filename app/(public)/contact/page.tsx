import type { Metadata } from "next";
import { JoinForm } from "@/components/contact/join-form";
import { Container } from "@/components/ui/container";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";

const listings = TERMINOLOGY.listing.plural.toLowerCase();
const entities = TERMINOLOGY.entity.plural.toLowerCase();

export const metadata: Metadata = {
  title: `List your ${listings}`,
  description: `${BUSINESS.name} lists ${listings} from ${entities}. Tell us about yours and we will reply by email.`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-(--public-text) sm:text-4xl">
          List your {listings}
        </h1>
        <p className="mt-4 text-base leading-7 text-(--public-text-muted)">
          {BUSINESS.name} lists {listings} from {entities}. Tell us about yours
          and we will reply by email.
        </p>
        <JoinForm />
      </div>
    </Container>
  );
}
