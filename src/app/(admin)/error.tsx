"use client";

import { useEffect } from "react";
import ErrorState from "@/components/shared/ErrorState";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error boundary]", error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
