import { z } from "zod";

/**
 * Mirrors the backend's Zod rules for POST /reviews/feedback so a visitor gets inline
 * feedback instead of a server round-trip. Keep the limits in step with the API — it
 * rejects with 422 on any mismatch.
 */
export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or fewer")
    .refine((v) => v === "" || v.length >= 2, "Name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message must be 2000 characters or fewer"),
});

export type FeedbackValues = z.infer<typeof feedbackSchema>;

export const emptyFeedbackValues: FeedbackValues = {
  name: "",
  message: "",
};
