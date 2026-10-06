import axios from "axios";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import LiveCourseEnrollments from "./_components/LiveCourseEnrollments";
import {
  getAdminLiveCourse,
  getAllLiveCourseEnrollments,
} from "@/services/liveCourses.service";
import { getAdminUsers } from "@/services/admin.service";
import type { LiveCourse, LiveCourseEnrollment, User } from "@/types/api";

async function loadCourse(id: string): Promise<LiveCourse | undefined> {
  try {
    const res = await getAdminLiveCourse(id);
    return res.success ? res.data : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

async function loadEnrollments(id: string): Promise<LiveCourseEnrollment[]> {
  try {
    return await getAllLiveCourseEnrollments(id);
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function loadUsers(): Promise<User[]> {
  try {
    const res = await getAdminUsers();
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

export default async function LiveCourseEnrollmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await loadCourse(id);
  if (!course) notFound();

  const [enrollments, users] = await Promise.all([loadEnrollments(id), loadUsers()]);

  return (
    <section>
      <BannerBg color="#2D135C">
        <Link
          href="/admin-live-courses"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-2"
        >
          <ArrowLeft size={16} /> Back to Live Courses
        </Link>
        <BannerTitleCase text={`Enrollments — ${course.title}`} />
      </BannerBg>
      <LiveCourseEnrollments courseId={id} enrollments={enrollments} users={users} />
    </section>
  );
}
