import { Suspense } from "react";
import axios from "axios";
import AdminCoursesHero from "./_components/AdminCoursesHero";
import AdminCourses from "./_components/AdminCourses";
import CoursesSkeleton from "./_components/CoursesSkeleton";
import { getCourses } from "@/services/courses.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Course } from "@/types/api";

async function loadCourses(): Promise<Course[]> {
  try {
    const res = await getCourses();
    console.log("[GET /courses] raw response:", JSON.stringify(res, null, 2));
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function CoursesData() {
  const courses = await loadCourses();
  return <AdminCourses courses={courses} />;
}

export default function AdminCoursesPage() {
  return (
    <AdminListProvider>
      <AdminCoursesHero />
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesData />
      </Suspense>
    </AdminListProvider>
  );
}
