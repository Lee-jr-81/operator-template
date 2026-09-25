import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function PublicNotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-(--public-text-muted)">
        That page does not exist or is no longer available.
      </p>
      <p className="mt-6">
        <Link
          href="/listings"
          className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
        >
          Browse Listings
        </Link>
      </p>
    </Container>
  );
}
