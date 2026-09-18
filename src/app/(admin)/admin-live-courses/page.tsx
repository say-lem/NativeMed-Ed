import { Suspense } from "react";
import axios from "axios";
import AdminLiveCoursesHero from "./_components/AdminLiveCoursesHero";
import AdminLiveCourses from "./_components/AdminLiveCourses";
import LiveCoursesSkeleton from "./_components/LiveCoursesSkeleton";
import { getAllAdminLiveCourses } from "@/services/liveCourses.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { AdminLiveCourse } from "@/types/api";

async function loadCourses(): Promise<AdminLiveCourse[]> {
  try {
    return await getAllAdminLiveCourses();
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function LiveCoursesData() {
  const courses = await loadCourses();
  return <AdminLiveCourses courses={courses} />;
}

export default function AdminLiveCoursesPage() {
  return (
    <AdminListProvider>
      <AdminLiveCoursesHero />
      <Suspense fallback={<LiveCoursesSkeleton />}>
        <LiveCoursesData />
      </Suspense>
    </AdminListProvider>
  );
}
