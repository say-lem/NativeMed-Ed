import { Suspense } from "react";
import axios from "axios";
import AdminDashboardStat from "./_components/AdminDashboardStat";
import AdminHero from "./_components/AdminHero";
import RecentSubscribers from "./_components/RecentSubscribers";
import UpcomingEventsWidget from "./_components/UpcomingEventsWidget";
import AdminDashboardSkeleton from "./_components/AdminDashboardSkeleton";
import RecentSubscribersSkeleton from "./_components/RecentSubscribersSkeleton";
import UpcomingEventsWidgetSkeleton from "./_components/UpcomingEventsWidgetSkeleton";
import { getAdminDashboard } from "@/services/admin.service";
import { getSubscribers } from "@/services/subscriptions.service";
import { getActivities } from "@/services/activities.service";
import type { Activity, AdminDashboardStats, Subscriber } from "@/types/api";

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

/** No "upcoming" filter on the backend — fetch everything, then keep future dates only. */
async function loadUpcomingEvents(): Promise<Activity[]> {
  try {
    const res = await getActivities(1, 50);
    if (!res.success) return [];
    const now = Date.now();
    return res.data.items
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, RECENT_LIMIT);
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

async function UpcomingEventsData() {
  const events = await loadUpcomingEvents();
  return <UpcomingEventsWidget events={events} />;
}

export default function AdminDashboard() {
  return (
    <>
      <AdminHero />
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<UpcomingEventsWidgetSkeleton />}>
        <UpcomingEventsData />
      </Suspense>
      <Suspense fallback={<RecentSubscribersSkeleton />}>
        <RecentSubscribersData />
      </Suspense>
    </>
  );
}
