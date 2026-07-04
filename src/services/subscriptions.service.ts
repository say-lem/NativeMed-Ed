import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, Subscriber } from "@/types/api";

/** GET /subscriptions/subscribers — admin. Plain array (NOT paginated). */
export async function getSubscribers(): Promise<ApiResponse<Subscriber[]>> {
  const res = await api.get<ApiResponse<Subscriber[]>>(
    "/subscriptions/subscribers",
  );
  return res.data;
}
