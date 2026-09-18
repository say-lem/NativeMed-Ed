import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { getCourses } from "@/services/courses.service";
import { courseBadgePrice } from "@/lib/price";
import type { Course } from "@/types/api";

async function loadCourses(cutBy: number): Promise<Course[]> {
  try {
    const res = await getCourses();
    if (!res.success) return [];
    // Newest first (ISO dates compare lexicographically) so `cutBy` shows the latest.
    const sorted = [...res.data].sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
    return cutBy > 0 ? sorted.slice(0, cutBy) : sorted;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[products-card] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function ProductsCard({ cutBy = 0 }: { cutBy?: number }) {
  const courses = await loadCourses(cutBy);

  if (courses.length === 0) {
    return (
      <p className="text-center text-subtle-text py-10">
        No products available right now. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9">
      {courses.map((course) => (
        <Link href={`/products/${course._id}`} key={course._id}>
          <div
            role="link"
            tabIndex={0}
            /* Arbitrary values can't contain spaces — `border-[rgba(247, 244, 251, 1)]` was
               invalid so no border colour was ever applied. Hex form works. */
            className="rounded-[16px] border-[0.5px] border-[#F7F4FB] cardShadow space-y-3 sm:space-y-4 lg:space-y-8 overflow-y-hidden pb-3 sm:pb-4 h-full flex flex-col"
          >
            <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64">
              <Image
                src={course.thumbnailUrl || "/Images/card image.png"}
                alt={`image of ${course.title}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </aside>

            <aside className="px-3 sm:px-4 lg:px-6 flex-1">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
                  {course.title}
                </p>
                {/* No fixed height: `h-28` (112px) was taller than the 3 clamped lines
                    (~63px), so the box showed ~5⅓ lines and sliced the last one through the
                    middle. The clamp alone ends the text cleanly with an ellipsis, and the
                    parent's `flex-1` still keeps every "View Course" button bottom-aligned. */}
                <p className="line-clamp-3 text-sm leading-[150%] text-[#373737]">
                  {course.description}
                </p>
              </div>
            </aside>

            <div className="px-3 sm:px-4 lg:px-6 flex justify-between items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-black-others">
                {courseBadgePrice(course)}
              </span>
              <span className="bg-black-others shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)] text-white rounded-md font-bold text-xs sm:text-sm leading-[150%] px-4 py-2">
                View Course
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
