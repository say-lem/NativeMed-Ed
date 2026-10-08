"use client";

import { useRouter } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";

export default function AdminBookingRefreshError() {
  const router = useRouter();
  return <ErrorState onRetry={() => router.refresh()} />;
}
