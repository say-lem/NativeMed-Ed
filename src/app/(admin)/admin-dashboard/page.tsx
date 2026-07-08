import { Suspense } from "react";
import axios from "axios";
import AdminDashboardStat from "./_components/AdminDashboardStat";
import AdminHero from "./_components/AdminHero";
import RecentSubscribers from "./_components/RecentSubscribers";
import AdminDashboardSkeleton from "./_components/AdminDashboardSkeleton";
import RecentSubscribersSkeleton from "./_components/RecentSubscribersSkeleton";
import { getAdminDashboard } from "@/services/admin.service";
import { getSubscribers } from "@/services/subscriptions.service";
import type { AdminDashboardStats, Subscriber } from "@/types/api";

const RECENT_LIMIT = 5;

async function loadStats(): Promise<AdminDashboardStats | undefined> {
  try {
    const res = await getAdminDashboard();
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

async function loadRecentSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await getSubscribers();
    return res.success ? res.data.slice(0, RECENT_LIMIT) : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

// Async boundaries: stream each section in independently.
async function DashboardStats() {
  const stats = await loadStats();
  return <AdminDashboardStat stats={stats} />;
}

async function RecentSubscribersData() {
  const subscribers = await loadRecentSubscribers();
  return <RecentSubscribers subscribers={subscribers} />;
}

export default function AdminDashboard() {
  return (
    <>
      <AdminHero />
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<RecentSubscribersSkeleton />}>
        <RecentSubscribersData />
      </Suspense>
    </>
  );
}
