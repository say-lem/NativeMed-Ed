import { Suspense } from "react";
import axios from "axios";
import AdminEventsHero from "./_components/AdminEventsHero";
import AdminEvents from "./_components/AdminEvents";
import AdminEventsSkeleton from "./_components/AdminEventsSkeleton";
import { getActivities } from "@/services/activities.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Activity } from "@/types/api";

async function loadEvents(): Promise<Activity[]> {
  try {
    const res = await getActivities(1, 100);
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function EventsData() {
  const events = await loadEvents();
  return <AdminEvents events={events} />;
}

export default function AdminEventsPage() {
  return (
    <AdminListProvider>
      <section>
        <AdminEventsHero />
        <Suspense fallback={<AdminEventsSkeleton />}>
          <EventsData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
