import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BRANDING } from "@/config/branding";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";

const explore = [
  { href: "/listings", label: TERMINOLOGY.listing.plural },
  { href: "/categories", label: TERMINOLOGY.category.plural },
  { href: "/articles", label: "Articles" },
  { href: "/login", label: "Operator login" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-(--public-footer) text-white">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <img
              src={BRANDING.logo.onDark}
              alt={BUSINESS.name}
              width={180}
              height={32}
              className="h-8 w-auto"
            />
            <p className="mt-5 text-sm leading-6 text-white/75">
              {BUSINESS.tagline}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-4 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/15">
        <Container className="py-5 text-sm text-white/60">
          © {year} {BUSINESS.name}
        </Container>
      </div>
    </footer>
  );
}
