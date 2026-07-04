import { z } from "zod";
import type { Course, CourseInput } from "@/types/api";

export const CATEGORIES = ["Course", "Session", "Webinar"];
export const PAYMENT_TYPES = ["One-time", "Subscription", "Free"];

export const courseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .regex(/^£?\s*\d+(\.\d{1,2})?$/, "Enter a valid price (e.g. 19.99)"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const emptyCourseValues: CourseFormValues = {
  title: "",
  price: "",
  description: "",
};

export function courseToFormValues(c: Course): CourseFormValues {
  return {
    title: c.title ?? "",
    price: c.price != null ? String(c.price) : "",
    description: c.description ?? "",
  };
}

export function buildCoursePayload(v: CourseFormValues): CourseInput {
  const priceStr = v.price.replace(/£/g, "").trim();
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    price: priceStr ? Number(priceStr) : 0,
  };
}
