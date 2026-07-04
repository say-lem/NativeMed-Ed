import { Suspense } from "react";
import axios from "axios";
import AdminSubHero from "./_components/AdminSubHero";
import Subscribers from "./_components/Subscribers";
import SubscribersSkeleton from "./_components/SubscribersSkeleton";
import { getSubscribers } from "@/services/subscriptions.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Subscriber } from "@/types/api";

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await getSubscribers();
    console.log(
      "[GET /subscriptions/subscribers] raw response:",
      JSON.stringify(res, null, 2),
    );
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function SubscribersData() {
  const subscribers = await loadSubscribers();
  return <Subscribers subscribers={subscribers} />;
}

export default function AdminSubscribers() {
  return (
    <AdminListProvider>
      <section>
        <AdminSubHero />
        <Suspense fallback={<SubscribersSkeleton />}>
          <SubscribersData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
