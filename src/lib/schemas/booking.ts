import { z } from "zod";
import type { CreateBookingProductInput, UpdateBookingProductInput } from "@/types/api";

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
  price: "",
  availableTimes: [],
};

export function bookingProductPayload(values: BookingProductValues): CreateBookingProductInput {
  return {
    title: values.title,
    description: values.description,
    price: Number(values.price),
    availableTimes: values.availableTimes,
  };
}

export function bookingProductUpdatePayload(
  values: BookingProductValues,
): UpdateBookingProductInput {
  return bookingProductPayload(values);
}
