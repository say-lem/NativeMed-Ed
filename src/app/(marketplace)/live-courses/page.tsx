import axios from "axios";
import { Suspense } from "react";
import YouMightAlsoLike from "@/components/shared/YouMightAlsoLike";
import { YmalSkeleton } from "@/components/shared/Skeletons";
import LiveCoursesBrowser from "./_components/LiveCoursesBrowser";
import { getLiveCourses } from "@/services/liveCourses.service";
import type { LiveCourse } from "@/types/api";

async function loadLiveCourses(): Promise<{ courses: LiveCourse[]; error: boolean }> {
  try {
    const res = await getLiveCourses();
    return { courses: res.success ? res.data : [], error: !res.success };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[live-courses] fetch error:", err.code, err.message);
    return { courses: [], error: true };
  }
}

export default async function LiveCoursesPage() {
  const { courses, error } = await loadLiveCourses();

  return (
    <>
      <LiveCoursesBrowser courses={courses} error={error} />
      <Suspense fallback={<YmalSkeleton />}>
        <YouMightAlsoLike excludeType="live_course" />
      </Suspense>
    </>
  );
}
