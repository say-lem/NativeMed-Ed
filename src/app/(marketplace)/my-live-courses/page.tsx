import axios from "axios";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import MyLiveCoursesList from "@/components/shared/MyLiveCoursesList";
import { getMyLiveCourseEnrollments } from "@/services/liveCourses.service";
import type { LiveCourseEnrollment } from "@/types/api";

async function loadEnrollments(): Promise<LiveCourseEnrollment[]> {
  try {
    const res = await getMyLiveCourseEnrollments();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-live-courses] fetch error:", {
      code: err.code,
      message: err.message,
      status: err.response?.status,
    });
    return [];
  }
}

export default async function MyLiveCoursesPage() {
  const enrollments = await loadEnrollments();

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="My Live Courses" />
      </BannerBg>
      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-10">
        <MyLiveCoursesList enrollments={enrollments} />
      </section>
    </>
  );
}
