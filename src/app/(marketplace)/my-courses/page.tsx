import axios from "axios";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import MyCoursesList from "@/components/shared/MyCoursesList";
import { getMyEnrollments } from "@/services/enrollments.service";
import type { Enrollment } from "@/types/api";

async function loadEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await getMyEnrollments();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[my-courses] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function MyCoursesPage() {
  const enrollments = await loadEnrollments();

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="My Courses" />
      </BannerBg>
      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-10">
        <MyCoursesList enrollments={enrollments} />
      </section>
    </>
  );
}
