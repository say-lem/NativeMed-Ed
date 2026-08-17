import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ContactValues } from "@/lib/schemas/contact";

/**
 * POST /contact — PUBLIC, no auth. Relays the message to the site inbox as an email;
 * nothing is persisted, so there's no list/history endpoint to pair with this.
 *
 * Returns **202 Accepted**, not 201: the send is queued behind a per-IP leaky bucket, so a
 * success here means "accepted", not "delivered". Verified against live data 2026-08-13 —
 * note the success body has NO `data` key at all (the doc claims `data: null`), so callers
 * must only read `success`/`message`.
 */
export async function sendContactMessage(
  payload: ContactValues,
): Promise<ApiResponse<null>> {
  const res = await api.post<ApiResponse<null>>("/contact", payload);
  return res.data;
}
