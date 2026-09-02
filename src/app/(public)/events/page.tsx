import axios from "axios";
import EventCard from "./_components/EventCard";
import PagePagination from "@/components/shared/PagePagination";
import { getActivities } from "@/services/activities.service";
import type { Activity, Paginated } from "@/types/api";

export const metadata = {
  title: "Events | Native Medical Education",
};

const PAGE_LIMIT = 12;

async function loadEvents(page: number): Promise<Paginated<Activity> | null> {
  try {
    const res = await getActivities(page, PAGE_LIMIT);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[events] fetch error:", err.code, err.message);
    } else {
      console.error("[events] unexpected error:", err);
    }
    return null;
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const data = await loadEvents(page);

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex flex-col items-center justify-center gap-3">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Events
        </h1>
        <p className="text-center text-subtle-text max-w-xl">
          Live classes and mock sessions from Native Medical Education.
        </p>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        {!data || data.items.length === 0 ? (
          <p className="text-center text-subtle-text py-10">
            {data ? "No events yet." : "We couldn't load events right now."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {data.items.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <PagePagination
              currentPage={data.page}
              totalPages={data.totalPages}
              basePath="/events"
            />
          </>
        )}
      </section>
    </>
  );
}
