import { z } from "zod";
import type { Course, CourseInput } from "@/types/api";

export const CATEGORIES = ["Course", "Session", "Webinar"];
export const PAYMENT_TYPES = ["One-time", "Subscription", "Free"];

/** Money input: optional, but must look like a price when filled. Kept as a string so an
 *  empty field means "this interval isn't offered" rather than 0. */
const priceField = z
  .string()
  .trim()
  .regex(/^(£?\s*\d+(\.\d{1,2})?)?$/, "Enter a valid price (e.g. 19.99)");

/** The backend accepts a raw folder ID or any Drive URL form (/drive/folders/<id>,
 *  /file/d/<id>/view, /open?id=<id>) and extracts the ID itself. We only reject input
 *  that clearly isn't either, so we don't out-guess the backend's parser.
 *
 *  `required` is false on **edit**: no GET returns the stored Drive links, so we can't
 *  prefill them. Forcing them would make an admin re-paste both just to fix a typo — and
 *  `buildCoursePayload` omits empty ones, so a PATCH leaves the stored values alone. */
const driveField = (required: boolean) =>
  z
    .string()
    .trim()
    .refine((v) => !required || v.length > 0, "Drive folder link is required")
    .refine(
      (v) =>
        v === "" ||
        (!/\s/.test(v) &&
          (/^[A-Za-z0-9_-]{10,}$/.test(v) || /^https?:\/\//.test(v))),
      "Paste a Google Drive folder link, or the folder ID on its own",
    );

export function makeCourseSchema(mode: "create" | "edit") {
  const driveRequired = mode === "create";
  return z
    .object({
      title: z.string().trim().min(3, "Title must be at least 3 characters"),
      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
      priceMonthly: priceField,
      priceQuarterly: priceField,
      lecturesDriveFolderId: driveField(driveRequired),
      mockSessionsDriveFolderId: driveField(driveRequired),
    })
    // Backend rule: at least one of the two prices must be set.
    .refine((v) => v.priceMonthly !== "" || v.priceQuarterly !== "", {
      message: "Set a monthly price, a quarterly price, or both",
      path: ["priceMonthly"],
    });
}

/** Create-mode schema (both Drive links required). */
export const courseSchema = makeCourseSchema("create");

export type CourseFormValues = z.infer<typeof courseSchema>;

export const emptyCourseValues: CourseFormValues = {
  title: "",
  description: "",
  priceMonthly: "",
  priceQuarterly: "",
  lecturesDriveFolderId: "",
  mockSessionsDriveFolderId: "",
};

const toStr = (n?: number) => (n != null ? String(n) : "");

/** Prefill for edit. Drive links are NOT returned by any GET today, so they normally come
 *  back empty and the admin must re-enter them — the form says so. Reads them anyway, for
 *  when the backend starts including them on admin routes. */
export function courseToFormValues(c: Course): CourseFormValues {
  return {
    title: c.title ?? "",
    description: c.description ?? "",
    priceMonthly: toStr(c.priceMonthly),
    priceQuarterly: toStr(c.priceQuarterly),
    lecturesDriveFolderId: c.lecturesDriveFolderId ?? "",
    mockSessionsDriveFolderId: c.mockSessionsDriveFolderId ?? "",
  };
}

const parsePrice = (v: string): number | undefined => {
  const s = v.replace(/£/g, "").trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

/** Build the API payload. Empty price → field omitted (that interval isn't offered).
 *  Empty Drive link → field omitted, so a PATCH doesn't wipe the stored value. */
export function buildCoursePayload(v: CourseFormValues): CourseInput {
  const payload: CourseInput = {
    title: v.title.trim(),
    description: v.description.trim(),
  };

  const monthly = parsePrice(v.priceMonthly);
  const quarterly = parsePrice(v.priceQuarterly);
  if (monthly != null) payload.priceMonthly = monthly;
  if (quarterly != null) payload.priceQuarterly = quarterly;

  const lectures = v.lecturesDriveFolderId.trim();
  const mockSessions = v.mockSessionsDriveFolderId.trim();
  if (lectures) payload.lecturesDriveFolderId = lectures;
  if (mockSessions) payload.mockSessionsDriveFolderId = mockSessions;

  return payload;
}
