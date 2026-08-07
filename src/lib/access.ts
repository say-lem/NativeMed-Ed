import "server-only";
import axios from "axios";
import { getCourseSubStatus } from "@/services/subscriptions.service";
import { checkEnrollment } from "@/services/enrollments.service";
import type { CourseTier } from "@/types/api";

export interface CourseAccess {
  hasAccess: boolean;
  tier?: CourseTier | string;
  /** How access was granted — useful for copy ("subscription renews…" vs "granted by admin"). */
  via?: "subscription" | "enrollment";
  /** Subscription-only billing details (absent for admin grants). */
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/**
 * A user has access to a course via EITHER a live subscription OR an enrollment
 * (manual grant / past payment). `tier` says how much of the course they can see.
 * Fails closed (no access) on error.
 *
 * Since 2026-08-07 the subscription status also carries `tier` + billing details, so we
 * prefer it when present and fall back to the enrollment's `accessTier` — an admin grant
 * has no subscription at all.
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
        // Subscription tier is authoritative; enrollment is the fallback because the
        // status payload only started including `tier` in the 2026-08-07 backend.
        tier: d?.tier ?? (enroll.success ? enroll.data.accessTier : undefined),
        via: "subscription",
        currentPeriodEnd: d?.currentPeriodEnd,
        cancelAtPeriodEnd: d?.cancelAtPeriodEnd,
        billingInterval: d?.billingInterval,
      };
    }

    return {
      hasAccess: true,
      tier: enroll.success ? enroll.data.accessTier : undefined,
      via: "enrollment",
    };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[course-access] fetch error:", err.code, err.message);
    return { hasAccess: false };
  }
}
