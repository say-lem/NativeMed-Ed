import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TitleCase from "./TitleCase";
import { getCourses } from "@/services/courses.service";
import type { Course } from "@/types/api";

async function loadCourses(excludeId?: string, limit = 2): Promise<Course[]> {
  try {
    const res = await getCourses();
    if (!res.success) return [];
    return res.data.filter((c) => c._id !== excludeId).slice(0, limit);
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[you-might-also-like] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function YouMightAlsoLike({
  excludeId,
  limit = 2,
}: {
  excludeId?: string;
  limit?: number;
}) {
  const courses = await loadCourses(excludeId, limit);
  if (courses.length === 0) return null;

  return (
    <section className="py-12 px-4 lg:px-8 space-y-4">
      <TitleCase text="You Might Also Like" />

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="rounded-[16px] p-1 bg-[#FFFFFF] alsoLikeBorder flex flex-col md:flex-row gap-6"
          >
            <aside className="relative w-full md:basis-1/4 min-h-40 sm:min-h-48 lg:min-h-64">
              <Image
                src={course.thumbnailUrl || "/Images/coursesImage.png"}
                alt={`image of ${course.title}`}
                fill
                className="object-cover object-center rounded-[8px]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </aside>

            <aside className="w-full md:basis-3/4 flex flex-col gap-4 py-4 px-6 justify-between sm:gap-6">
              <h3 className="font-semibold text-lg sm:text-xl leading-[130%] tracking-[-2%] text-black-others line-clamp-2">
                {course.title}
              </h3>
              {course.description && (
                <p className="font-light text-sm sm:text-base leading-[150%] text-[#373737] line-clamp-3">
                  {course.description}
                </p>
              )}

              <div className="flex justify-end">
                <Link
                  href={`/courses/${course._id}`}
                  className="rounded-[8px] bg-black-others text-white font-bold text-sm px-5 py-2.5 hover:bg-black/85"
                >
                  View course
                </Link>
              </div>
            </aside>
          </div>
        ))}
      </div>
    </section>
  );
}
