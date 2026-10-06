import "server-only";
import { api } from "@/lib/api";
import type {
  AdminBookingProduct,
  AdminSessionBooking,
  AdminSlotAvailabilityRequest,
  ApiResponse,
  BookingCheckout,
  BookingProduct,
  BookSessionInput,
  CreateBookingProductInput,
  MyBooking,
  Paginated,
  RequestSlotAvailabilityInput,
  SlotAvailabilityRequest,
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

/** POST /booking/:id/book — auth required. Reserves the (date, time) slot and starts a
 *  Stripe Checkout session; the booking is `pending` until the webhook confirms payment
 *  (see `confirmBookingPayment` on the backend). Redirect the browser to the returned
 *  `url` — nothing is booked yet at this point. */
export async function bookSession(
  id: string,
  input: BookSessionInput,
): Promise<ApiResponse<BookingCheckout>> {
  const res = await api.post<ApiResponse<BookingCheckout>>(`/booking/${id}/book`, input);
  return res.data;
}

/** GET /booking/:bookingId/resume-payment — auth. Returns the SAME Stripe checkout session
 *  for a booking that's still `pending` and within its hour-long payment window, rather than
 *  minting a new one. 404 if not found/not owned, 400 if no longer pending, 410 once the
 *  window (ours or Stripe's own session expiry) has passed. */
export async function resumeBookingPayment(
  bookingId: string,
): Promise<ApiResponse<BookingCheckout>> {
  const res = await api.get<ApiResponse<BookingCheckout>>(
    `/booking/${bookingId}/resume-payment`,
  );
  return res.data;
}

/** GET /booking/me — auth. The signed-in user's own bookings, newest date first. */
export async function getMyBookings(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<MyBooking>>> {
  const res = await api.get<ApiResponse<Paginated<MyBooking>>>("/booking/me", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /booking/:id/request-slot — auth. Only accepted when the product genuinely has
 *  no open (date, time) slot right now — 400s otherwise (the user should just book
 *  directly instead). Emails the admin; doesn't reserve anything. */
export async function requestSlotAvailability(
  id: string,
  input: RequestSlotAvailabilityInput,
): Promise<ApiResponse<SlotAvailabilityRequest>> {
  const res = await api.post<ApiResponse<SlotAvailabilityRequest>>(
    `/booking/${id}/request-slot`,
    input,
  );
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin — products
// ─────────────────────────────────────────────────────────────────────────────

/** GET /admin/booking/products — admin, every product incl. drafts and booked dates. */
export async function getAdminBookingProducts(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<AdminBookingProduct>>> {
  const res = await api.get<ApiResponse<Paginated<AdminBookingProduct>>>(
    "/admin/booking/products",
    { params: { page, limit } },
  );
  return res.data;
}

/** POST /admin/booking/products — admin. */
export async function createBookingProduct(
  input: CreateBookingProductInput,
): Promise<ApiResponse<AdminBookingProduct>> {
  const res = await api.post<ApiResponse<AdminBookingProduct>>(
    "/admin/booking/products",
    input,
  );
  return res.data;
}

/** PATCH /admin/booking/products/:id — admin. Partial; `availableTimes` replaces wholesale. */
export async function updateBookingProduct(
  id: string,
  input: UpdateBookingProductInput,
): Promise<ApiResponse<AdminBookingProduct>> {
  const res = await api.patch<ApiResponse<AdminBookingProduct>>(
    `/admin/booking/products/${id}`,
    input,
  );
  return res.data;
}

/** PATCH /admin/booking/products/:id/image — admin, multipart field `image` (resized
 *  800×450). */
export async function updateBookingProductImage(
  id: string,
  file: File,
): Promise<ApiResponse<{ imageUrl: string }>> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await api.patch<ApiResponse<{ imageUrl: string }>>(
    `/admin/booking/products/${id}/image`,
    fd,
    { headers: { "Content-Type": undefined } },
  );
  return res.data;
}

/** PATCH /admin/booking/products/:id/publish|unpublish — admin. */
export async function setBookingProductPublished(
  id: string,
  isPublished: boolean,
): Promise<ApiResponse<AdminBookingProduct>> {
  const res = await api.patch<ApiResponse<AdminBookingProduct>>(
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
): Promise<ApiResponse<AdminBookingProduct>> {
  const res = await api.post<ApiResponse<AdminBookingProduct>>(
    `/admin/booking/products/${id}/dates`,
    { date },
  );
  return res.data;
}

/** DELETE /admin/booking/products/:id/dates/:dateId — admin. 400 if the date has any bookings. */
export async function removeAvailableDate(
  id: string,
  dateId: string,
): Promise<ApiResponse<AdminBookingProduct>> {
  const res = await api.delete<ApiResponse<AdminBookingProduct>>(
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

// ─────────────────────────────────────────────────────────────────────────────
// Admin — slot availability requests
// ─────────────────────────────────────────────────────────────────────────────

/** GET /admin/booking/slot-requests — admin, paginated, newest first. */
export async function getAdminSlotAvailabilityRequests(
  page = 1,
  limit = 20,
): Promise<ApiResponse<Paginated<AdminSlotAvailabilityRequest>>> {
  const res = await api.get<ApiResponse<Paginated<AdminSlotAvailabilityRequest>>>(
    "/admin/booking/slot-requests",
    { params: { page, limit } },
  );
  return res.data;
}

/** PATCH /admin/booking/slot-requests/:id/resolve — admin. */
export async function resolveSlotAvailabilityRequest(
  id: string,
): Promise<ApiResponse<AdminSlotAvailabilityRequest>> {
  const res = await api.patch<ApiResponse<AdminSlotAvailabilityRequest>>(
    `/admin/booking/slot-requests/${id}/resolve`,
  );
  return res.data;
}

/** DELETE /admin/booking/slot-requests/:id — admin. */
export async function deleteSlotAvailabilityRequest(id: string): Promise<ApiResponse<null>> {
  const res = await api.delete<ApiResponse<null>>(`/admin/booking/slot-requests/${id}`);
  return res.data;
}
