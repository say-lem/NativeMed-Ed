"use server";
import axios from "axios";
import {
  getCaseBankStatus,
  getCourseSubStatus,
} from "@/services/subscriptions.service";
import { checkEnrollment } from "@/services/enrollments.service";

/**
 * Poll target for the success page. Access is granted by a Stripe **webhook**, which lands
 * a second or two after the browser is redirected back — so the page has to keep asking.
 *
 * For a course we accept EITHER an active subscription OR an enrollment: the webhook writes
 * both, and whichever appears first means the user can get in.
 */
export async function checkPurchaseActive(
  type: string,
  courseId?: string,
): Promise<{ active: boolean }> {
  try {
    if (type === "course") {
      if (!courseId) return { active: false };
      const [sub, enroll] = await Promise.all([
        getCourseSubStatus(courseId),
        checkEnrollment(courseId),
      ]);
      const active =
        (sub.success && sub.data.active) ||
        (enroll.success && enroll.data.enrolled);
      return { active: Boolean(active) };
    }

    const res = await getCaseBankStatus();
    return { active: Boolean(res.success && res.data.active) };
  } catch (err) {
    // A failed poll is not a failed purchase — report "not yet" and let the caller retry.
    if (axios.isAxiosError(err)) {
      console.error(
        "[payment/success] status poll failed:",
        err.response?.status ?? err.code,
      );
    } else {
      console.error("[payment/success] status poll error:", err);
    }
    return { active: false };
  }
}
