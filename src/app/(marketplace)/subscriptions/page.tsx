import axios from "axios";
import { Suspense } from "react";
import YouMightAlsoLike from "@/components/shared/YouMightAlsoLike";
import { YmalSkeleton } from "@/components/shared/Skeletons";
import SubscriptionsBrowser from "./_components/SubscriptionsBrowser";
import { getMySubscriptions } from "@/services/subscriptions.service";
import type { Subscription } from "@/types/api";

async function loadSubscriptions(): Promise<Subscription[]> {
  try {
    const res = await getMySubscriptions();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[subscriptions] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function SubscriptionPage() {
  const subscriptions = await loadSubscriptions();

  return (
    <>
      <SubscriptionsBrowser subscriptions={subscriptions} />
      <Suspense fallback={<YmalSkeleton />}>
        <YouMightAlsoLike />
      </Suspense>
    </>
  );
}
