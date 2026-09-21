import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  visibleHomepageContext,
  type HomepageContext,
} from "@/lib/homepage/context";
import { publicSectionClass } from "@/lib/public-layout";

function ContextActionIcon({ href }: { href: string }) {
  const isArticles = href.startsWith("/articles");

  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-6 w-6 shrink-0 text-(--public-text)"
      aria-hidden="true"
    >
      {isArticles ? (
        <path
          d="M6 4.5h9.5L18 7v12.5H6zM15.5 4.5V7H18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M4.5 4.5h6.5v6.5H4.5zm8.5 0h6.5v6.5H13zm-8.5 8.5h6.5v6.5H4.5zm8.5 0h6.5v6.5H13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      )}
    </svg>
  );
}

function ContextHeading({
  heading,
  underline,
}: {
  heading: string;
  underline: string;
}) {
  const index = underline
    ? heading.toLowerCase().indexOf(underline.toLowerCase())
    : -1;

  if (index < 0) {
    return heading;
  }

  const end = index + underline.length;

  return (
    <>
      {heading.slice(0, index)}
      <span className="underline decoration-2 decoration-(--brand-primary) underline-offset-[0.24em]">
        {heading.slice(index, end)}
      </span>
      {heading.slice(end)}
    </>
  );
}

export function HomepageContextSection({
  context,
}: {
  context: HomepageContext;
}) {
  const visible = visibleHomepageContext(context);

  if (!visible) {
    return null;
  }

  return (
    <Container className={publicSectionClass}>
      <section>
        <h2 className="text-center text-[28px] font-bold tracking-tight text-(--public-text) lg:text-[32px]">
          <ContextHeading
            heading={visible.heading}
            underline={visible.underline}
          />
        </h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-4 text-center">
          {visible.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-7 text-(--public-text-muted)"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {visible.actions.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visible.actions.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-(--public-border) bg-white px-5 py-4.5 transition duration-200 hover:border-(--brand-primary)"
                >
                  <ContextActionIcon href={action.href} />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-base font-semibold text-(--public-text) transition duration-200 group-hover:text-(--brand-primary)">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-(--public-text-muted)">
                      {action.copy}
                    </span>
                  </span>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--brand-primary) text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 5l8 7-8 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </Container>
  );
}
