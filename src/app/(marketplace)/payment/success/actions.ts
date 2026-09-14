"use server";
import axios from "axios";
import {
  getCaseBankStatus,
  getCourseSubStatus,
} from "@/services/subscriptions.service";
import { checkEnrollment } from "@/services/enrollments.service";
import { getMyBookings } from "@/services/booking.service";

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
  sessionId?: string,
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

    if (type === "booking") {
      // There's no per-booking status endpoint — the webhook confirms it as a plain
      // `SessionBooking.status` flip, so match the checkout session id (unique per
      // booking) against the user's own booking list to find the one just paid for.
      if (!sessionId) return { active: false };
      const res = await getMyBookings(1, 100);
      if (!res.success) return { active: false };
      const booking = res.data.items.find((b) => b.stripeCheckoutSessionId === sessionId);
      return { active: booking?.status === "confirmed" };
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
