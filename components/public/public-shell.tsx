import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-(--public-bg) text-(--public-text)">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <PublicHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <div className="h-20 bg-(--public-bg) sm:h-28" aria-hidden="true" />
      <PublicFooter />
    </div>
  );
}
