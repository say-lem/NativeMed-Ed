import axios from "axios";
import Link from "next/link";
import MyCoursesList from "@/components/shared/MyCoursesList";
import { getMyEnrollments } from "@/services/enrollments.service";
import type { Enrollment } from "@/types/api";

async function loadEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await getMyEnrollments();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[dashboard/my-courses] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function MyCoursesSection() {
  const enrollments = await loadEnrollments();

  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
          My Courses
        </h2>
        <Link
          href="/my-courses"
          className="text-sm font-medium text-primary-100 hover:underline shrink-0"
        >
          View all
        </Link>
      </div>
      <MyCoursesList enrollments={enrollments} limit={3} />
    </section>
  );
}
