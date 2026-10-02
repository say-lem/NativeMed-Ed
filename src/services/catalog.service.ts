import "server-only";
import { api } from "@/lib/api";
import { getAllBookingProducts } from "@/services/booking.service";
import type { ApiResponse, CatalogProduct } from "@/types/api";

/** GET /products — public. Everything a user can pay for: courses, one-on-one
 *  booking sessions, and the case bank, in one flat discriminated list.
 *
 *  `/products` doesn't return `imageUrl` for `one_on_one` items even though the
 *  underlying booking product has one — backfilled here from `GET /booking`. */
export async function getCatalog(): Promise<ApiResponse<CatalogProduct[]>> {
  const res = await api.get<ApiResponse<CatalogProduct[]>>("/products");
  if (!res.data.success) return res.data;

  const hasOneOnOne = res.data.data.some((p) => p.type === "one_on_one");
  if (!hasOneOnOne) return res.data;

  const bookingProducts = await getAllBookingProducts();
  const imageById = new Map(bookingProducts.map((b) => [b._id, b.imageUrl]));

  return {
    ...res.data,
    data: res.data.data.map((p) =>
      p.type === "one_on_one" ? { ...p, imageUrl: imageById.get(p._id) } : p,
    ),
  };
}
