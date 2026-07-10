import Image from "next/image";
import Link from "next/link";
import type { Enrollment } from "@/types/api";

const TIER_LABEL: Record<string, string> = {
  pdf_only: "PDF Only",
  pdf_drive: "PDF + Drive",
};

/** The populated course object on an enrollment (null if it came back as an id). */
function populatedCourse(e: Enrollment) {
  return typeof e.courseId === "object" && e.courseId ? e.courseId : null;
}

export default function MyCoursesList({
  enrollments,
  limit,
  emptyMessage = "You're not enrolled in any courses yet.",
}: {
  enrollments: Enrollment[];
  limit?: number;
  emptyMessage?: string;
}) {
  const active = enrollments.filter((e) => e.isActive !== false);
  const rows = limit ? active.slice(0, limit) : active;

  if (rows.length === 0) {
    return (
      <div className="py-10 text-center text-subtle-text">
        {emptyMessage}{" "}
        <Link
          href="/courses"
          className="text-primary-100 font-medium hover:underline"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
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
              {e.accessTier && (
                <span className="absolute top-2 right-2 rounded-[100px] py-1 px-3 bg-[#00000080] border-[0.2px] border-white/80 text-xs font-semibold text-white">
                  {TIER_LABEL[e.accessTier] ?? e.accessTier}
                </span>
              )}
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
  );
}
