import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

/**
 * GET /courses — PUBLIC. Returns a plain array (NOT paginated): `data: []`.
 * Item shape is unknown for now (collection empty in prod, no schema doc),
 * so the element type is `unknown` until we see a real record.
 */
export async function getCourses(): Promise<ApiResponse<unknown[]>> {
  const res = await api.get<ApiResponse<unknown[]>>("/courses");
  return res.data;
}
