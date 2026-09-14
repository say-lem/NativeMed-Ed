"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  addAvailableDate,
  createBookingProduct,
  deleteBookingProduct,
  removeAvailableDate,
  setBookingProductPublished,
  updateBookingProduct,
} from "@/services/booking.service";
import {
  bookingProductSchema,
  bookingProductPayload,
  bookingProductUpdatePayload,
  type BookingProductValues,
} from "@/lib/schemas/booking";
import type { ApiFailure, FormActionResult } from "@/types/api";

function fail(err: unknown, tag: string, fallback: string): FormActionResult {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFailure | undefined;
    console.error(`[${tag}] axios error:`, err.code, err.message);
    return { ok: false, message: data?.message ?? fallback, fieldErrors: data?.errors };
  }
  console.error(`[${tag}] unexpected error:`, err);
  return { ok: false, message: "Something went wrong." };
}

function revalidateBooking() {
  revalidatePath("/admin-booking");
  revalidatePath("/products");
  revalidatePath("/one-on-one");
  revalidatePath("/dashboard");
}

export async function addBookingProductAction(
  values: BookingProductValues,
): Promise<FormActionResult> {
  const parsed = bookingProductSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await createBookingProduct(bookingProductPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateBooking();
    return { ok: true, message: "Session product added" };
  } catch (err) {
    return fail(err, "addBookingProductAction", "Couldn't add the session product.");
  }
}

export async function updateBookingProductAction(
  id: string,
  values: BookingProductValues,
): Promise<FormActionResult> {
  const parsed = bookingProductSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateBookingProduct(id, bookingProductUpdatePayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidateBooking();
    return { ok: true, message: "Session product updated" };
  } catch (err) {
    return fail(err, "updateBookingProductAction", "Couldn't update the session product.");
  }
}

export async function setBookingProductPublishedAction(
  id: string,
  isPublished: boolean,
): Promise<FormActionResult> {
  try {
    const res = await setBookingProductPublished(id, isPublished);
    if (!res.success) return { ok: false, message: res.message };
    revalidateBooking();
    return { ok: true, message: isPublished ? "Session product published" : "Session product unpublished" };
  } catch (err) {
    return fail(err, "setBookingProductPublishedAction", "Couldn't change visibility.");
  }
}

export async function deleteBookingProductAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteBookingProduct(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidateBooking();
    return { ok: true, message: "Session product deleted" };
  } catch (err) {
    return fail(err, "deleteBookingProductAction", "Couldn't delete the session product.");
  }
}

/** `date` is a yyyy-mm-dd string from a native date input. */
export async function addAvailableDateAction(
  productId: string,
  date: string,
): Promise<FormActionResult> {
  if (!date) return { ok: false, message: "Choose a date first." };
  try {
    const res = await addAvailableDate(productId, date);
    if (!res.success) return { ok: false, message: res.message };
    revalidateBooking();
    return { ok: true, message: "Date added" };
  } catch (err) {
    return fail(err, "addAvailableDateAction", "Couldn't add the date.");
  }
}

export async function removeAvailableDateAction(
  productId: string,
  dateId: string,
): Promise<FormActionResult> {
  try {
    const res = await removeAvailableDate(productId, dateId);
    if (!res.success) return { ok: false, message: res.message };
    revalidateBooking();
    return { ok: true, message: "Date removed" };
  } catch (err) {
    return fail(err, "removeAvailableDateAction", "Couldn't remove the date.");
  }
}

const MAX_RANGE_DAYS = 366;

/** Every yyyy-mm-dd from `from` to `to` inclusive. Both are yyyy-mm-dd (native date input
 *  values), which `Date` parses as UTC midnight, so day math stays timezone-safe. */
function enumerateDays(from: string, to: string): string[] {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  const out: string[] = [];
  for (let d = start; d.getTime() <= end.getTime(); d = new Date(d.getTime() + 86400000)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/**
 * Adds every date in [from, to] inclusive — there's no bulk endpoint, so this loops the
 * single-date one sequentially. A date already in the pool 400s; that's expected when
 * ranges overlap, so it's counted as "skipped" rather than failing the whole batch.
 */
export async function addAvailableDateRangeAction(
  productId: string,
  from: string,
  to: string,
): Promise<FormActionResult> {
  if (!from || !to) return { ok: false, message: "Choose both a start and end date." };
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, message: "Invalid date range." };
  }
  if (start.getTime() > end.getTime()) {
    return { ok: false, message: "Start date must be on or before the end date." };
  }

  const days = enumerateDays(from, to);
  if (days.length > MAX_RANGE_DAYS) {
    return { ok: false, message: `That range is too large — please narrow it to ${MAX_RANGE_DAYS} days or fewer.` };
  }

  let added = 0;
  let skipped = 0;
  for (const day of days) {
    try {
      const res = await addAvailableDate(productId, day);
      if (res.success) added++;
      else skipped++;
    } catch {
      skipped++;
    }
  }

  revalidateBooking();
  if (added === 0) {
    return { ok: false, message: `No dates added — all ${skipped} were already in the pool.` };
  }
  return {
    ok: true,
    message: skipped > 0 ? `Added ${added} dates (${skipped} already existed)` : `Added ${added} dates`,
  };
}
