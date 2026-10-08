import { z } from "zod";
import type { ActivityInput, ActivityProduct } from "@/types/api";

/** Mirrors the backend's Zod rules for POST/PATCH /admin/activities. */
export const activitySchema = z.object({
  time: z.string().trim().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:mm time"),
  activityType: z.string().trim().max(100),
  activityStatus: z.string().trim().max(100),
  product: z.string().regex(/^$|^case_bank$|^(course|live_course|one_on_one|free_product):[a-fA-F0-9]{24}$/, "Choose a valid product"),
  isPublished: z.boolean(),
  date: z.string().trim().min(1, "Date is required"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
});

export type ActivityValues = z.infer<typeof activitySchema>;

export const emptyActivityValues: ActivityValues = {
  time: "",
  activityType: "",
  activityStatus: "",
  product: "",
  isPublished: true,
  date: "",
  description: "",
};

/** Blank metadata is omitted: the backend does not accept clearing these strings. */
export function activityPayload(values: ActivityValues): ActivityInput {
  const [type, id] = values.product.split(":");
  const product: ActivityProduct | null = !values.product
    ? null
    : type === "case_bank"
      ? { type: "case_bank" }
      : { type: type as Exclude<ActivityProduct["type"], "case_bank">, id };
  return {
    ...values,
    time: values.time || undefined,
    activityType: values.activityType || undefined,
    activityStatus: values.activityStatus || undefined,
    product,
  };
}
