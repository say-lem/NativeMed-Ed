import axios from "axios";
import Link from "next/link";
import MyLiveCoursesList from "@/components/shared/MyLiveCoursesList";
import { getMyLiveCourseEnrollments } from "@/services/liveCourses.service";
import type { LiveCourseEnrollment } from "@/types/api";

async function loadEnrollments(): Promise<LiveCourseEnrollment[]> {
  try {
    const res = await getMyLiveCourseEnrollments();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[dashboard/my-live-courses] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function MyLiveCoursesSection() {
  const enrollments = await loadEnrollments();
  if (enrollments.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
          My Live Courses
        </h2>
        <Link
          href="/my-live-courses"
          className="text-sm font-medium text-primary-100 hover:underline shrink-0"
        >
          View all
        </Link>
      </div>
      <MyLiveCoursesList enrollments={enrollments} limit={3} />
    </section>
  );
}
