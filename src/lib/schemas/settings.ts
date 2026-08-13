import { z } from "zod";
import { EXAM_SITTING_RE } from "./auth";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
  /** `PATCH /auth/me` accepts this (unlike the admin edit endpoint, which strips it). */
  telegramUsername: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^@?[A-Za-z0-9_]{4,32}$/.test(v),
      "Use letters, numbers and underscores (min 4 characters)",
    )
    .optional(),
  /** Optional here (unlike register) — accounts created before 2026-08-12 have none, and
   *  `PATCH /auth/me` only validates the format when the field is actually sent. */
  examSitting: z
    .string()
    .refine((v) => v === "" || EXAM_SITTING_RE.test(v), "Select a valid exam sitting")
    .optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
