import { BUSINESS } from "@/config/business";

export function MarketplaceProof() {
  const items = BUSINESS.homepage.proof;

  return (
    <section aria-label="Marketplace proof">
      <ul className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex min-h-40 flex-col rounded-(--radius-card)  bg-(--public-surface) p-7 lg:min-h-50 lg:p-8"
          >
            <p className="text-[44px] font-regular leading-none text-(--brand-primary) lg:text-[48px]">
              {item.value}
            </p>
            <h3 className="mt-4 text-[16px] font-semibold text-(--public-text) lg:text-[17px]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-(--public-text-muted)">
              {item.copy}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
