import { Suspense } from "react";
import axios from "axios";
import AdminCoursesHero from "./_components/AdminCoursesHero";
import AdminCourses from "./_components/AdminCourses";
import CoursesSkeleton from "./_components/CoursesSkeleton";
import { getAllAdminCourses } from "@/services/courses.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Course } from "@/types/api";

async function loadCourses(): Promise<Course[]> {
  try {
    return await getAllAdminCourses();
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
