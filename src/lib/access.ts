import "server-only";
import axios from "axios";
import { getCourseSubStatus } from "@/services/subscriptions.service";
import { checkEnrollment } from "@/services/enrollments.service";

export interface CourseAccess {
  hasAccess: boolean;
  /** How access was granted — useful for copy ("subscription renews…" vs "granted by admin"). */
  via?: "subscription" | "enrollment";
  /** Subscription-only billing details (absent for admin grants). */
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/**
 * A user has access to a course via EITHER a live subscription OR an enrollment
 * (manual grant / past payment). Fails closed (no access) on error.
 *
 * Courses no longer have access tiers — a course is one Drive folder, one price per
 * interval — so this only answers yes/no, not "how much" access.
 */
export async function getCourseAccess(courseId: string): Promise<CourseAccess> {
  try {
    const [sub, enroll] = await Promise.all([
      getCourseSubStatus(courseId),
      checkEnrollment(courseId),
    ]);

    const subActive = sub.success && sub.data.active;
    const enrolled = enroll.success && enroll.data.enrolled;

    if (!subActive && !enrolled) return { hasAccess: false };

    if (subActive) {
      const d = sub.success ? sub.data : undefined;
      return {
        hasAccess: true,
        via: "subscription",
        currentPeriodEnd: d?.currentPeriodEnd,
        cancelAtPeriodEnd: d?.cancelAtPeriodEnd,
        billingInterval: d?.billingInterval,
      };
    }

    return { hasAccess: true, via: "enrollment" };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[course-access] fetch error:", err.code, err.message);
    return { hasAccess: false };
  }
}
