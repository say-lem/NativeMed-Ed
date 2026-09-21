import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  CaseBankSettings,
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

/* ------------------------------------------------------------------ *
 * Admin — Case Bank access management
 * ------------------------------------------------------------------ */

/** POST /subscriptions/case-bank/enroll — admin. Grant Case Bank access without
 *  payment, for `durationDays` (1–3650) from now. */
export async function manualGrantCaseBank(
  userId: string,
  durationDays: number,
): Promise<ApiResponse<Subscription>> {
  const res = await api.post<ApiResponse<Subscription>>(
    "/subscriptions/case-bank/enroll",
    { userId, durationDays },
  );
  return res.data;
}

/** POST /subscriptions/case-bank/revoke — admin. Cancels on Stripe first (if it's a real
 *  Stripe subscription) then marks the local record cancelled. 404 if the user has no
 *  active Case Bank subscription. */
export async function revokeCaseBankAccess(
  userId: string,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>(
    "/subscriptions/case-bank/revoke",
    { userId },
  );
  return res.data;
}

/** PATCH /subscriptions/case-bank/restore — admin. Grants a fresh `durationDays` period
 *  after a revoke (Stripe has no "uncancel", so this always starts a new local period).
 *  400 if the user already has active access. */
export async function restoreCaseBankAccess(
  userId: string,
  durationDays: number,
): Promise<ApiResponse<Subscription>> {
  const res = await api.patch<ApiResponse<Subscription>>(
    "/subscriptions/case-bank/restore",
    { userId, durationDays },
  );
  return res.data;
}

/** PATCH /subscriptions/case-bank/pause-payments — admin, no body. Blocks new Case Bank
 *  checkouts (400) without touching existing subscribers' access. */
export async function pauseCaseBankPayments(): Promise<ApiResponse<CaseBankSettings>> {
  const res = await api.patch<ApiResponse<CaseBankSettings>>(
    "/subscriptions/case-bank/pause-payments",
  );
  return res.data;
}

/** PATCH /subscriptions/case-bank/resume-payments — admin, no body. */
export async function resumeCaseBankPayments(): Promise<ApiResponse<CaseBankSettings>> {
  const res = await api.patch<ApiResponse<CaseBankSettings>>(
    "/subscriptions/case-bank/resume-payments",
  );
  return res.data;
}
