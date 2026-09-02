import Link from "next/link";
import { formatDate } from "@/lib/date";
import type { Activity } from "@/types/api";

export default function UpcomingEventsWidget({ events }: { events: Activity[] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl leading-[130%] tracking-[-2%] text-black font-semibold">
          Upcoming Events
        </h1>
        <Link
          href="/admin-events"
          className="text-primary-100 text-sm font-semibold hover:underline underline-offset-2"
        >
          Manage
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-subtle-text py-6">No upcoming events posted.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[500px] flex flex-col">
            {events.map((e) => (
              <div
                key={e._id}
                className="grid grid-cols-[140px_1fr] items-center gap-6 border-b border-[#EDEDED] py-5"
              >
                <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-black-others">
                  {formatDate(e.date)}
                </p>
                <p className="text-sm font-normal leading-[150%] text-subtle-text line-clamp-2">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
