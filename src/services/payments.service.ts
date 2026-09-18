import "server-only";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  Paginated,
  PaymentPlan,
} from "@/types/api";

/** Billing interval accepted by checkout. Confirm the full set against `/payments/plans`. */
export type PaymentInterval = "monthly" | "quarterly" | string;

/** POST /payments/checkout body. Courses no longer have access tiers — a course is one
 *  Drive folder, one price per interval. */
export interface CheckoutInput {
  type: "case_bank" | "course";
  interval: PaymentInterval;
  courseId?: string; // required when type === "course"
  successUrl: string;
  cancelUrl: string;
}

/** GET /payments/plans — PUBLIC pricing catalog. Verified 2026-07-10. */
export async function getPaymentPlans(): Promise<ApiResponse<PaymentPlan[]>> {
  const res = await api.get<ApiResponse<PaymentPlan[]>>("/payments/plans");
  return res.data;
}

/**
 * POST /payments/checkout — auth. Creates a Stripe checkout session.
 * Response shape (Stripe URL / session id) unverified — probe when wiring Buy Now.
 */
export async function createCheckout(
  payload: CheckoutInput,
): Promise<ApiResponse<unknown>> {
  const res = await api.post<ApiResponse<unknown>>(
    "/payments/checkout",
    payload,
  );
  return res.data;
}

/** POST /payments/billing-portal — auth. Returns a Stripe customer-portal URL. */
export async function getBillingPortal(
  returnUrl: string,
): Promise<ApiResponse<unknown>> {
  const res = await api.post<ApiResponse<unknown>>("/payments/billing-portal", {
    returnUrl,
  });
  return res.data;
}

/** GET /payments/me — auth. Paginated payment history. Shape unverified. */
export async function getMyPayments(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<unknown>>> {
  const res = await api.get<ApiResponse<Paginated<unknown>>>("/payments/me", {
    params: { page, limit },
  });
  return res.data;
}
