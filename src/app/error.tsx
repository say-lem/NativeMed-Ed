"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold text-black-others">
          Couldn&apos;t reach the server
        </h1>
        <p className="text-subtle-text leading-[150%]">
          We&apos;re having trouble connecting right now. This is usually
          temporary — the server may be waking up. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-[8px] bg-primary text-white text-sm font-medium px-6 py-3 cursor-pointer hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
