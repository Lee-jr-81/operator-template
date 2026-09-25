import { BUSINESS } from "@/config/business";

function ProofIcon({
  name,
}: {
  name: "location" | "paw" | "message" | "guide";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-(--brand-primary)"
      aria-hidden="true"
    >
      {name === "location" ? (
        <>
          <path
            d="M12 20.5s6.2-5.4 6.2-9.8a6.2 6.2 0 1 0-12.4 0c0 4.4 6.2 9.8 6.2 9.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="10.6"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </>
      ) : null}
      {name === "paw" ? (
        <>
          <circle cx="6.6" cy="9.2" r="1.55" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="10.2" cy="6.3" r="1.55" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="14.4" cy="6.3" r="1.55" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.8" cy="9.4" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8.4 13.1c.35 3 1.7 4.7 3.6 4.7s3.25-1.7 3.6-4.7c.25-1.9-1.35-2.9-3.6-2.9s-3.85 1-3.6 2.9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {name === "message" ? (
        <>
          <path
            d="M4.5 7h15v10.2h-15z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 7.6 12 13l7.5-5.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {name === "guide" ? (
        <>
          <path
            d="M6 4.5h9.2L18 7.2V19.5H6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M15.2 4.5V7.2H18M8.4 11.4h7.2M8.4 14.8h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
    </svg>
  );
}

export function MarketplaceProof() {
  const items = BUSINESS.homepage.proof;

  return (
    <section aria-label="Marketplace proof">
      <ul className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col rounded-(--radius-card) bg-(--public-surface) p-7 lg:p-8"
          >
            <ProofIcon name={item.icon} />
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
