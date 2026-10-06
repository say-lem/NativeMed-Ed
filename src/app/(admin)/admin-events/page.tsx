import { Suspense } from "react";
import { getAllAdminCourses } from "@/services/courses.service";
import AdminEventsHero from "./_components/AdminEventsHero";
import AdminEvents from "./_components/AdminEvents";
import AdminEventsSkeleton from "./_components/AdminEventsSkeleton";
import { getAdminActivities } from "@/services/activities.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Activity } from "@/types/api";

async function loadEvents(): Promise<Activity[]> {
  const first = await getAdminActivities(1, 50);
  if (!first.success) throw new Error(first.message);
  const events = [...first.data.items];
  for (let page = 2; page <= first.data.totalPages; page++) {
    const res = await getAdminActivities(page, 50);
    if (!res.success) throw new Error(res.message);
    events.push(...res.data.items);
  }
  return events;
}

async function EventsData() {
  const [events, courses] = await Promise.all([loadEvents(), getAllAdminCourses()]);
  return <AdminEvents events={events} courses={courses.map(({ _id, title, isPublished }) => ({ _id, title, isPublished }))} />;
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
