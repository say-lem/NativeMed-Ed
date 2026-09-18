import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { LiveCourse } from "@/types/api";
import { liveCourseBadgePrice } from "@/lib/price";
import { formatDate } from "@/lib/date";

export default function LiveCoursesCard({
  courses,
  error,
}: {
  courses: LiveCourse[];
  error?: boolean;
}) {
  if (error) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        We couldn&apos;t load live courses right now. Please try again in a moment.
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        No live courses available yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
      {courses.map((course) => (
        <Link
          key={course._id}
          href={`/live-courses/${course._id}`}
          className="rounded-[16px] overflow-hidden courseBorder pb-4 bg-white hover:scale-105 transition-transform cursor-pointer flex flex-col"
        >
          <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64">
            <Image
              src={course.thumbnailUrl || "/Images/coursesImage.png"}
              alt={`image of ${course.title}`}
              fill
              className="object-cover object-center rounded-[8px]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
              {liveCourseBadgePrice(course)}
            </p>
          </aside>

          <aside className="px-3 sm:px-4 lg:px-6 pt-6 space-y-3 flex-1 flex flex-col">
            <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
              {course.title}
            </p>
            {course.description && (
              <p className="text-xs sm:text-sm leading-[150%] text-subtle-text line-clamp-3">
                {course.description}
              </p>
            )}
            <p className="flex items-center gap-1.5 text-xs text-subtle-text mt-auto">
              <CalendarDays size={13} />
              {formatDate(course.startDate)} – {formatDate(course.endDate)}
            </p>
          </aside>
        </Link>
      ))}
    </div>
  );
}
