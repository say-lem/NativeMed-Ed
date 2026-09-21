import { Suspense } from "react";
import axios from "axios";
import AdminSubHero from "./_components/AdminSubHero";
import CaseBankAccessPanel from "./_components/CaseBankAccessPanel";
import Subscribers from "./_components/Subscribers";
import SubscribersSkeleton from "./_components/SubscribersSkeleton";
import { getSubscribers } from "@/services/subscriptions.service";
import { getAdminUsers } from "@/services/admin.service";
import { getPaymentPlans } from "@/services/payments.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Subscriber, User } from "@/types/api";

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await getSubscribers();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function loadUsers(): Promise<User[]> {
  try {
    const res = await getAdminUsers();
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

/** `paymentsPaused` is merged onto the case_bank plan group at request time —
 *  see PaymentPlan in types/api.ts. Defaults to unpaused if the plan is somehow
 *  missing rather than blocking the page. */
async function loadCaseBankPaymentsPaused(): Promise<boolean> {
  try {
    const res = await getPaymentPlans();
    if (!res.success) return false;
    return res.data.find((p) => p.type === "case_bank")?.paymentsPaused ?? false;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return false;
  }
}

async function SubscribersData() {
  const subscribers = await loadSubscribers();
  return <Subscribers subscribers={subscribers} />;
}

export default async function AdminSubscribers() {
  const [users, paymentsPaused] = await Promise.all([
    loadUsers(),
    loadCaseBankPaymentsPaused(),
  ]);

  return (
    <AdminListProvider>
      <section>
        <AdminSubHero />
        <div className="px-4 sm:px-6 lg:px-10 mt-6">
          <CaseBankAccessPanel users={users} initialPaymentsPaused={paymentsPaused} />
        </div>
        <Suspense fallback={<SubscribersSkeleton />}>
          <SubscribersData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
