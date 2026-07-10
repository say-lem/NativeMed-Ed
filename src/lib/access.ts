import "server-only";
import axios from "axios";
import { getCourseSubStatus } from "@/services/subscriptions.service";
import { checkEnrollment } from "@/services/enrollments.service";

export interface CourseAccess {
  hasAccess: boolean;
  tier?: "pdf_only" | "pdf_drive";
}

/**
 * A user has access to a course via EITHER a live subscription OR an enrollment
 * (manual grant / past payment). `tier` (from the enrollment) says how much of
 * the course they can see. Fails closed (no access) on error.
 */
export async function getCourseAccess(courseId: string): Promise<CourseAccess> {
  try {
    const [sub, enroll] = await Promise.all([
      getCourseSubStatus(courseId),
      checkEnrollment(courseId),
    ]);
    const active = sub.success && sub.data.active;
    const enrolled = enroll.success && enroll.data.enrolled;
    const tier = enroll.success ? enroll.data.accessTier : undefined;
    return { hasAccess: Boolean(active || enrolled), tier };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[course-access] fetch error:", err.code, err.message);
    return { hasAccess: false };
  }
}
