import axios from "axios";
import { Suspense } from "react";
import YouMightAlsoLike from "@/components/shared/YouMightAlsoLike";
import { YmalSkeleton } from "@/components/shared/Skeletons";
import CoursesBrowser from "./_components/CoursesBrowser";
import { getCourses } from "@/services/courses.service";
import type { Course } from "@/types/api";

async function loadCourses(): Promise<{ courses: Course[]; error: boolean }> {
  try {
    const res = await getCourses();
    return { courses: res.success ? res.data : [], error: !res.success };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[courses] fetch error:", err.code, err.message);
    return { courses: [], error: true };
  }
}

export default async function CoursesPage() {
  const { courses, error } = await loadCourses();

  return (
    <>
      <CoursesBrowser courses={courses} error={error} />
      <Suspense fallback={<YmalSkeleton />}>
        <YouMightAlsoLike />
      </Suspense>
    </>
  );
}
