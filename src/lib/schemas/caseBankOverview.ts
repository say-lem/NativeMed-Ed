import { z } from "zod";
import type { UpdateCaseBankOverviewInput } from "@/types/api";

/** Mirrors the backend's Zod rules for PATCH /cases/admin/overview. */
export const caseBankOverviewSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000),
  // Optional — blank means the case bank's own page shows no separate write-up (just
  // the short description). The backend only enforces the 10-char minimum once
  // something's typed.
  detailedDescription: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.length >= 10,
      "Detailed description must be at least 10 characters",
    ),
});

export type CaseBankOverviewValues = z.infer<typeof caseBankOverviewSchema>;

export function caseBankOverviewPayload(
  values: CaseBankOverviewValues,
): UpdateCaseBankOverviewInput {
  const payload: UpdateCaseBankOverviewInput = {
    title: values.title.trim(),
    description: values.description.trim(),
  };
  const detailedDescription = values.detailedDescription.trim();
  if (detailedDescription) payload.detailedDescription = detailedDescription;
  return payload;
}
