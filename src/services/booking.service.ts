import "server-only";
import { api } from "@/lib/api";
import type {
  AdminSessionBooking,
  ApiResponse,
  BookingProduct,
  BookSessionInput,
  CreateBookingProductInput,
  Paginated,
  SessionBooking,
  UpdateBookingProductInput,
} from "@/types/api";

// ─────────────────────────────────────────────────────────────────────────────
// Public
// ─────────────────────────────────────────────────────────────────────────────

/** GET /booking — public, paginated. `availableDates` pre-filtered to unbooked only. */
export async function getBookingProducts(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<BookingProduct>>> {
  const res = await api.get<ApiResponse<Paginated<BookingProduct>>>("/booking", {
    params: { page, limit },
  });
  return res.data;
}

/** Fetches every published page in parallel (mirrors `getAllAdminCases`) — the number of
 *  session products is expected to stay small. */
export async function getAllBookingProducts(): Promise<BookingProduct[]> {
  const first = await getBookingProducts(1, 50);
  if (!first.success) return [];

  const { items, totalPages } = first.data;
  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => getBookingProducts(i + 2, 50)),
  );

  const all = [...items];
  for (const res of rest) if (res.success) all.push(...res.data.items);
  return all;
}

/** GET /booking/:id — public, same date filtering as the list. */
export async function getBookingProduct(id: string): Promise<ApiResponse<BookingProduct>> {
  const res = await api.get<ApiResponse<BookingProduct>>(`/booking/${id}`);
  return res.data;
}

/** POST /booking/:id/book — auth required. No payment gate; reserves the date atomically. */
export async function bookSession(
  id: string,
  input: BookSessionInput,
): Promise<ApiResponse<SessionBooking>> {
  const res = await api.post<ApiResponse<SessionBooking>>(`/booking/${id}/book`, input);
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin — products
// ─────────────────────────────────────────────────────────────────────────────

/** GET /admin/booking/products — admin, every product incl. drafts and booked dates. */
export async function getAdminBookingProducts(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<BookingProduct>>> {
  const res = await api.get<ApiResponse<Paginated<BookingProduct>>>("/admin/booking/products", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /admin/booking/products — admin. */
export async function createBookingProduct(
  input: CreateBookingProductInput,
): Promise<ApiResponse<BookingProduct>> {
  const res = await api.post<ApiResponse<BookingProduct>>("/admin/booking/products", input);
  return res.data;
}

/** PATCH /admin/booking/products/:id — admin. Partial; `availableTimes` replaces wholesale. */
export async function updateBookingProduct(
  id: string,
  input: UpdateBookingProductInput,
): Promise<ApiResponse<BookingProduct>> {
  const res = await api.patch<ApiResponse<BookingProduct>>(
    `/admin/booking/products/${id}`,
    input,
  );
  return res.data;
}

/** PATCH /admin/booking/products/:id/publish|unpublish — admin. */
export async function setBookingProductPublished(
  id: string,
  isPublished: boolean,
): Promise<ApiResponse<BookingProduct>> {
  const res = await api.patch<ApiResponse<BookingProduct>>(
    `/admin/booking/products/${id}/${isPublished ? "publish" : "unpublish"}`,
  );
  return res.data;
}

/** DELETE /admin/booking/products/:id — admin. Permanent; also deletes every booking for it. */
export async function deleteBookingProduct(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/booking/products/${id}`);
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin — available dates
// ─────────────────────────────────────────────────────────────────────────────

/** POST /admin/booking/products/:id/dates — admin. `date` is yyyy-mm-dd. 400 if already added. */
export async function addAvailableDate(
  id: string,
  date: string,
): Promise<ApiResponse<BookingProduct>> {
  const res = await api.post<ApiResponse<BookingProduct>>(
    `/admin/booking/products/${id}/dates`,
    { date },
  );
  return res.data;
}

/** DELETE /admin/booking/products/:id/dates/:dateId — admin. 400 if already booked. */
export async function removeAvailableDate(
  id: string,
  dateId: string,
): Promise<ApiResponse<BookingProduct>> {
  const res = await api.delete<ApiResponse<BookingProduct>>(
    `/admin/booking/products/${id}/dates/${dateId}`,
  );
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin — bookings
// ─────────────────────────────────────────────────────────────────────────────

/** GET /admin/booking/bookings — admin, paginated, every booking across every product. */
export async function getAdminBookings(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<AdminSessionBooking>>> {
  const res = await api.get<ApiResponse<Paginated<AdminSessionBooking>>>(
    "/admin/booking/bookings",
    { params: { page, limit } },
  );
  return res.data;
}
