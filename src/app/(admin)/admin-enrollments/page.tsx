import { Suspense } from "react";
import axios from "axios";
import AdminEnrollmentsHero from "./_components/AdminEnrollmentsHero";
import Enrollments from "./_components/Enrollments";
import EnrollmentsSkeleton from "./_components/EnrollmentsSkeleton";
import { getEnrollments } from "@/services/enrollments.service";
import { getAdminUsers } from "@/services/admin.service";
import { getAdminCourses } from "@/services/courses.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { Course, Enrollment, User } from "@/types/api";

async function loadEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await getEnrollments();
    if (!res.success) return [];
    return Array.isArray(res.data) ? res.data : (res.data.items ?? []);
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

async function loadCourses(): Promise<Course[]> {
  try {
    const res = await getAdminCourses();
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function EnrollmentsData() {
  const [enrollments, users, courses] = await Promise.all([
    loadEnrollments(),
    loadUsers(),
    loadCourses(),
  ]);
  return (
    <Enrollments enrollments={enrollments} users={users} courses={courses} />
  );
}

export default function AdminEnrollmentsPage() {
  return (
    <AdminListProvider>
      <section>
        <AdminEnrollmentsHero />
        <Suspense fallback={<EnrollmentsSkeleton />}>
          <EnrollmentsData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
