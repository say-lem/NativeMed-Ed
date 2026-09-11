import Link from "next/link";
import type { Activity } from "@/types/api";

export default function EventDetails({ event, duplicate = false }: { event: Activity; duplicate?: boolean }) {
  return (
    <div className="flex-1 min-w-0 space-y-2">
      {event.activityType && <div className="flex justify-end"><span className="max-w-full break-words rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-white">{event.activityType}</span></div>}
      {event.activityStatus && <h3 className="text-base sm:text-lg font-semibold text-secondary-100 break-words">{event.activityStatus}</h3>}
      {event.time && <p className="text-sm font-medium text-primary-100">{event.time}</p>}
      <p className="text-sm sm:text-base leading-[150%] text-secondary-100 break-words">{event.description}</p>
      {event.courseId && <Link href={`/products/${event.courseId}`} tabIndex={duplicate ? -1 : undefined} className="inline-flex rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">View course info</Link>}
    </div>
  );
}
