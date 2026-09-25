"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-(--public-text-muted)">
        Please try again. If the problem continues, contact the developer.
      </p>
      <p className="mt-6">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </p>
    </main>
  );
}
