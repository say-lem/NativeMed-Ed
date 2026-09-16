import { z } from "zod";
import { EXAM_SITTING_RE } from "@/lib/schemas/auth";
import type {
  CreateBookingProductInput,
  RequestSlotAvailabilityInput,
  UpdateBookingProductInput,
} from "@/types/api";

const timeField = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24-hour HH:mm format");

/** Mirrors the backend's Zod rules for the booking-product admin endpoints. */
export const bookingProductSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  // Optional — blank means the session's detail page shows no separate write-up (just
  // the short description above). The backend only enforces the 10-char minimum once
  // something's typed.
  detailedDescription: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.length >= 10,
      "Detailed description must be at least 10 characters",
    ),
  price: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
    .refine((v) => Number(v) >= 0, "Price cannot be negative"),
  availableTimes: z.array(timeField),
});

export type BookingProductValues = z.infer<typeof bookingProductSchema>;

export const emptyBookingProductValues: BookingProductValues = {
  title: "",
  description: "",
  detailedDescription: "",
  price: "",
  availableTimes: [],
};

export function bookingProductPayload(values: BookingProductValues): CreateBookingProductInput {
  const payload: CreateBookingProductInput = {
    title: values.title,
    description: values.description,
    price: Number(values.price),
    availableTimes: values.availableTimes,
  };
  const detailedDescription = values.detailedDescription.trim();
  if (detailedDescription) payload.detailedDescription = detailedDescription;
  return payload;
}

export function bookingProductUpdatePayload(
  values: BookingProductValues,
): UpdateBookingProductInput {
  return bookingProductPayload(values);
}

// ─────────────────────────────────────────────────────────────────────────────
// Slot availability requests — POST /booking/:id/request-slot
// ─────────────────────────────────────────────────────────────────────────────

/** Mirrors the backend's Zod rules for POST /booking/:id/request-slot. `preferredDates`
 *  are yyyy-mm-dd strings from native date inputs (coerced to Date backend-side). */
export const slotAvailabilityRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200, "Name must be 200 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address").max(254),
  examSitting: z
    .string()
    .trim()
    .regex(EXAM_SITTING_RE, "Select your exam sitting"),
  preferredDates: z
    .array(z.string().min(1))
    .min(1, "Pick at least one preferred date")
    .max(10, "No more than 10 preferred dates"),
});

export type SlotAvailabilityRequestValues = z.infer<typeof slotAvailabilityRequestSchema>;

export function slotAvailabilityRequestPayload(
  values: SlotAvailabilityRequestValues,
): RequestSlotAvailabilityInput {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    examSitting: values.examSitting,
    preferredDates: values.preferredDates,
  };
}
