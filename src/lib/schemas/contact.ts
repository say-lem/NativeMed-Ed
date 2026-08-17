import { z } from "zod";

/**
 * Mirrors the backend's Zod rules for POST /contact so a visitor gets inline feedback
 * instead of a server round-trip. Keep the limits in step with the API — it rejects with
 * 422 on any mismatch.
 */
export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or fewer"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be 5000 characters or fewer"),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const emptyContactValues: ContactValues = {
  fullName: "",
  email: "",
  message: "",
};
