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
