import { z } from "zod";

/** Mirrors the backend's Zod rules for POST/PATCH /admin/activities. */
export const activitySchema = z.object({
  date: z.string().trim().min(1, "Date is required"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
});

export type ActivityValues = z.infer<typeof activitySchema>;

export const emptyActivityValues: ActivityValues = {
  date: "",
  description: "",
};
