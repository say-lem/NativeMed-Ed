import "server-only";
import { api } from "@/lib/api";
import type { ApiResponse, CatalogProduct } from "@/types/api";

/** GET /products — public. Everything a user can pay for: courses, one-on-one
 *  booking sessions, and the case bank, in one flat discriminated list. */
export async function getCatalog(): Promise<ApiResponse<CatalogProduct[]>> {
  const res = await api.get<ApiResponse<CatalogProduct[]>>("/products");
  return res.data;
}
