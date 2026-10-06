import { z } from "zod";

/**
 * Mirrors the backend's Zod rules for POST /reviews so a visitor gets inline feedback
 * instead of a server round-trip. Keep the limits in step with the API — it rejects with
 * 422 on any mismatch.
 */
export const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  examSat: z
    .string()
    .trim()
    .min(2, "Exam is required")
    .max(100, "Exam must be 100 characters or fewer"),
  datePassed: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Enter the date as MM/YY, e.g. 03/26"),
  rating: z
    .number({ error: "Pick a rating" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  review: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review must be 2000 characters or fewer"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;

export const emptyReviewValues: ReviewValues = {
  name: "",
  examSat: "",
  datePassed: "",
  rating: 0,
  review: "",
};
