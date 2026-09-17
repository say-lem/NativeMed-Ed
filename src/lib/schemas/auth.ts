import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

/** `examSitting` must be exactly `MM/YY` (e.g. `03/26`) — the backend rejects `3/26`,
 *  `13/26` and anything free-text. */
export const EXAM_SITTING_RE = /^(0[1-9]|1[0-2])\/\d{2}$/;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Upcoming exam sittings as `{ value, label }`, e.g. `{ value: "03/26", label: "March 2026" }`.
 *
 * Deliberately a `<select>` rather than `<input type="month">`: Safari on desktop doesn't
 * support that input type and silently falls back to a free-text box, which would let users
 * type anything and hit the backend's strict MM/YY validation. A select makes an invalid
 * value impossible, and its value is already in the API's format so nothing needs converting.
 */
export function examSittingOptions(
  from: Date = new Date(),
  count = 24,
): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    out.push({
      value: `${month}/${String(year).slice(2)}`,
      label: `${MONTH_NAMES[d.getMonth()]} ${year}`,
    });
  }
  return out;
}

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  examSitting: z
    .string()
    .min(1, "Select your exam sitting")
    .regex(EXAM_SITTING_RE, "Select your exam sitting"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

/** Client-only: adds the sign-up consent checkbox on top of the fields the backend expects. */
export const registerFormSchema = registerSchema.extend({
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms & Conditions, Legal Disclaimer and Privacy Policy",
  }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
