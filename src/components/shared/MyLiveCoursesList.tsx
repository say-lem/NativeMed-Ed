import Image from "next/image";
import Link from "next/link";
import ContainedImage from "./ContainedImage";
import type { LiveCourseEnrollment } from "@/types/api";

function populatedCourse(e: LiveCourseEnrollment) {
  return typeof e.courseId === "object" && e.courseId ? e.courseId : null;
}

function EmptyState({
  heading,
  message,
  cta,
  alt,
}: {
  heading: string;
  message: string;
  cta: string;
  alt: string;
}) {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative w-64 h-56 sm:w-80 sm:h-72 mb-8">
        <Image
          src="/Images/empty-courses.png"
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-black-others mb-3">
        {heading}
      </h2>

      <p className="text-subtle-text leading-[170%] max-w-md mb-8">{message}</p>

      <Link
        href="/live-courses"
        className="inline-flex items-center gap-2 rounded-[8px] bg-primary-100 text-white text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity"
      >
        {cta}
      </Link>
    </section>
  );
}

function UnavailableNotice({ count }: { count: number }) {
  return (
    <p className="mb-6 rounded-[8px] border border-[#F5C26B] bg-[#FFF8EC] px-4 py-3 text-sm text-[#7A4B00]">
      {count === 1
        ? "1 live course you have access to is no longer available."
        : `${count} live courses you have access to are no longer available.`}{" "}
      They may have been removed. Your access is still on record — contact support if you
      believe this is a mistake.
    </p>
  );
}

export default function MyLiveCoursesList({
  enrollments,
  limit,
  emptyMessage = "You haven't purchased any live courses yet.",
}: {
  enrollments: LiveCourseEnrollment[];
  limit?: number;
  emptyMessage?: string;
}) {
  const active = enrollments.filter((e) => e.isActive !== false);
  const renderable = active.filter((e) => populatedCourse(e));
  const unavailable = active.length - renderable.length;
  const rows = limit ? renderable.slice(0, limit) : renderable;

  if (rows.length === 0 && unavailable > 0) {
    return (
      <EmptyState
        alt="Courses unavailable illustration"
        heading="Your live courses aren't available"
        message={`You have access to ${unavailable} ${unavailable === 1 ? "live course" : "live courses"}, but ${unavailable === 1 ? "it is" : "they are"} no longer available. Contact support if you believe this is a mistake, or browse what's currently on offer.`}
        cta="Browse Live Courses"
      />
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        alt="No live courses illustration"
        heading="No live courses yet"
        message={`${emptyMessage} Explore what's coming up and reserve your spot.`}
        cta="Browse Live Courses"
      />
    );
  }

  return (
    <>
      {unavailable > 0 && <UnavailableNotice count={unavailable} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {rows.map((e) => {
          const course = populatedCourse(e);
          if (!course) return null;
          return (
            <Link
              key={e._id}
              href={`/my-live-courses/${course._id}`}
              className="rounded-[16px] overflow-hidden courseBorder pb-4 bg-white hover:scale-[1.02] transition-transform flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-from-radial-bg">
                <ContainedImage
                  src={course.thumbnailUrl || "/Images/coursesImage.png"}
                  alt={`image of ${course.title ?? "live course"}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="px-4 pt-4 space-y-1 flex-1">
                <p className="font-semibold text-base text-black-others line-clamp-2">
                  {course.title ?? "Untitled live course"}
                </p>
                <p className="text-xs text-primary-100 font-medium">
                  Continue learning →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
