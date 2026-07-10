import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  CaseBankStatus,
  CourseSubStatus,
  Subscriber,
  Subscription,
} from "@/types/api";

/** GET /subscriptions/subscribers — admin. Plain array (NOT paginated). */
export async function getSubscribers(): Promise<ApiResponse<Subscriber[]>> {
  const res = await api.get<ApiResponse<Subscriber[]>>(
    "/subscriptions/subscribers",
  );
  return res.data;
}

/** GET /subscriptions/me — auth. The signed-in user's Stripe subscriptions
 *  (case_bank + per-course). Verified 2026-07-10. */
export async function getMySubscriptions(): Promise<
  ApiResponse<Subscription[]>
> {
  const res = await api.get<ApiResponse<Subscription[]>>("/subscriptions/me");
  return res.data;
}

/** GET /subscriptions/course/:courseId/status — auth. Is there a live
 *  subscription granting access to this course? Verified 2026-07-10. */
export async function getCourseSubStatus(
  courseId: string,
): Promise<ApiResponse<CourseSubStatus>> {
  const res = await api.get<ApiResponse<CourseSubStatus>>(
    `/subscriptions/course/${courseId}/status`,
  );
  return res.data;
}

/** GET /subscriptions/case-bank/status — auth. Is the Case Bank subscription
 *  active (unlocks all cases)? Verified 2026-07-10. */
export async function getCaseBankStatus(): Promise<
  ApiResponse<CaseBankStatus>
> {
  const res = await api.get<ApiResponse<CaseBankStatus>>(
    "/subscriptions/case-bank/status",
  );
  return res.data;
}
