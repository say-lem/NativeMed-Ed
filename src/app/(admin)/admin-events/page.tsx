import { Suspense } from "react";
import { getAllAdminCourses } from "@/services/courses.service";
import { getAllAdminLiveCourses } from "@/services/liveCourses.service";
import { getAdminBookingProducts } from "@/services/booking.service";
import { getAdminFreeProducts } from "@/services/freeProducts.service";
import type { ActivityProductOption } from "@/lib/activity-product";
import AdminEventsHero from "./_components/AdminEventsHero";
import AdminEvents from "./_components/AdminEvents";
import AdminEventsSkeleton from "./_components/AdminEventsSkeleton";
import { getAdminActivities } from "@/services/activities.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Activity, ApiResponse, Paginated } from "@/types/api";

async function loadAll<T>(fetchPage: (page: number, limit: number) => Promise<ApiResponse<Paginated<T>>>): Promise<T[]> {
  const first = await fetchPage(1, 50);
  if (!first.success) throw new Error(first.message);
  const items = [...first.data.items];
  for (let page = 2; page <= first.data.totalPages; page++) {
    const res = await fetchPage(page, 50);
    if (!res.success) throw new Error(res.message);
    items.push(...res.data.items);
  }
  return items;
}

async function loadProductOptions(): Promise<ActivityProductOption[]> {
  const [courses, liveCourses, sessions, freeProducts] = await Promise.all([
    getAllAdminCourses(),
    getAllAdminLiveCourses(),
    loadAll(getAdminBookingProducts),
    loadAll(getAdminFreeProducts),
  ]);
  return [
    { value: "case_bank", title: "Case Bank", isPublished: true },
    ...courses.map((p) => ({ value: `course:${p._id}`, title: `Course — ${p.title}`, isPublished: Boolean(p.isPublished) })),
    ...liveCourses.map((p) => ({ value: `live_course:${p._id}`, title: `Live course — ${p.title}`, isPublished: Boolean(p.isPublished) })),
    ...sessions.map((p) => ({ value: `one_on_one:${p._id}`, title: `One-on-one — ${p.title}`, isPublished: Boolean(p.isPublished) })),
    ...freeProducts.map((p) => ({ value: `free_product:${p._id}`, title: `Free ${p.type} — ${p.title}`, isPublished: Boolean(p.isPublished) })),
  ];
}

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
  const [events, products] = await Promise.all([loadEvents(), loadProductOptions()]);
  return <AdminEvents events={events} products={products} />;
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
