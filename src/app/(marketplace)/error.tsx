"use client";

import { useEffect } from "react";
import ErrorState from "@/components/shared/ErrorState";

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketplace error boundary]", error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
