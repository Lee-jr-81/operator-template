import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-(--public-text-muted)">
        That page does not exist or is no longer available.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="text-sm font-medium text-(--brand-primary) underline-offset-4 hover:text-(--brand-secondary) hover:underline"
        >
          Back to home
        </Link>
      </p>
    </main>
  );
}
