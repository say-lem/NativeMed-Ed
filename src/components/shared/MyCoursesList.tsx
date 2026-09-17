import Image from "next/image";
import Link from "next/link";
import type { Enrollment } from "@/types/api";

/** The populated course object on an enrollment. Null when `courseId` came back as a
 *  bare id string, or as `null` — which the backend returns when the referenced course
 *  has been deleted (populate on a missing doc). Either way there's nothing to render. */
function populatedCourse(e: Enrollment) {
  return typeof e.courseId === "object" && e.courseId ? e.courseId : null;
}

/** Shared shell for the two no-cards states. */
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
        href="/courses"
        className="inline-flex items-center gap-2 rounded-[8px] bg-primary-100 text-white text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity"
      >
        {cta}
      </Link>
    </section>
  );
}

/** Notice for active enrollments whose course no longer exists. */
function UnavailableNotice({ count }: { count: number }) {
  return (
    <p className="mb-6 rounded-[8px] border border-[#F5C26B] bg-[#FFF8EC] px-4 py-3 text-sm text-[#7A4B00]">
      {count === 1
        ? "1 course you have access to is no longer available."
        : `${count} courses you have access to are no longer available.`}{" "}
      They may have been removed by the tutor. Your access is still on record —
      contact support if you believe this is a mistake.
    </p>
  );
}

export default function MyCoursesList({
  enrollments,
  limit,
  emptyMessage = "You haven't enrolled in any courses yet.",
}: {
  enrollments: Enrollment[];
  limit?: number;
  emptyMessage?: string;
}) {
  const active = enrollments.filter((e) => e.isActive !== false);
  // Only enrollments with a populated course can render a card — filter them out
  // BEFORE the empty check, otherwise we emit an empty grid and no empty state.
  const renderable = active.filter((e) => populatedCourse(e));
  const unavailable = active.length - renderable.length;
  const rows = limit ? renderable.slice(0, limit) : renderable;

  // Has access, but every course behind it is gone — distinct from "never enrolled".
  if (rows.length === 0 && unavailable > 0) {
    return (
      <EmptyState
        alt="Courses unavailable illustration"
        heading="Your courses aren't available"
        message={`You have access to ${unavailable} ${unavailable === 1 ? "course" : "courses"}, but ${unavailable === 1 ? "it is" : "they are"} no longer available — ${unavailable === 1 ? "it may" : "they may"} have been removed. Contact support if you believe this is a mistake, or browse what's currently on offer.`}
        cta="Browse Courses"
      />
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        alt="No courses enrolled illustration"
        heading="No courses yet"
        message={`${emptyMessage} Explore our library and find the perfect course to start your learning journey.`}
        cta="Browse Courses"
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
              href={`/my-courses/${course._id}`}
              className="rounded-[16px] overflow-hidden courseBorder pb-4 bg-white hover:scale-[1.02] transition-transform flex flex-col"
            >
              <div className="relative w-full min-h-40 sm:min-h-48">
                <Image
                  src={course.thumbnailUrl || "/Images/coursesImage.png"}
                  alt={`image of ${course.title ?? "course"}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="px-4 pt-4 space-y-1 flex-1">
                <p className="font-semibold text-base text-black-others line-clamp-2">
                  {course.title ?? "Untitled course"}
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
