import { z } from "zod";
import type { AdminCourse, CourseInput, CoursePricing } from "@/types/api";

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
 *  `required` is false on **edit**: an admin may leave a link blank to keep the stored
 *  folder (`buildCoursePayload` omits empty fields from the PATCH). Since 2026-08-10 admin
 *  GETs DO return the links, so they normally arrive prefilled. */
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

/**
 * Pricing is per access tier since 2026-08-10 — four inputs, and **each tier** needs at
 * least one interval. On create the backend requires both tiers; on edit it merges, so a
 * tier left entirely blank keeps whatever is stored.
 */
export function makeCourseSchema(mode: "create" | "edit") {
  const isCreate = mode === "create";

  return z
    .object({
      title: z.string().trim().min(3, "Title must be at least 3 characters"),
      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),
      sessionsMonthly: priceField,
      sessionsQuarterly: priceField,
      lecturesMonthly: priceField,
      lecturesQuarterly: priceField,
      lecturesDriveFolderId: driveField(isCreate),
      mockSessionsDriveFolderId: driveField(isCreate),
    })
    .superRefine((v, ctx) => {
      // Mirrors the backend rule per tier. On edit, a fully blank tier is allowed (it
      // isn't sent, so the stored price survives) — but a partially filled one is fine too.
      if (isCreate && v.sessionsMonthly === "" && v.sessionsQuarterly === "") {
        ctx.addIssue({
          code: "custom",
          path: ["sessionsMonthly"],
          message: "Set a monthly or quarterly price for Mock Sessions Only",
        });
      }
      if (isCreate && v.lecturesMonthly === "" && v.lecturesQuarterly === "") {
        ctx.addIssue({
          code: "custom",
          path: ["lecturesMonthly"],
          message:
            "Set a monthly or quarterly price for Mock Sessions + Lectures",
        });
      }
    });
}

/** Create-mode schema (both Drive links + both tiers required). */
export const courseSchema = makeCourseSchema("create");

export type CourseFormValues = z.infer<typeof courseSchema>;

export const emptyCourseValues: CourseFormValues = {
  title: "",
  description: "",
  sessionsMonthly: "",
  sessionsQuarterly: "",
  lecturesMonthly: "",
  lecturesQuarterly: "",
  lecturesDriveFolderId: "",
  mockSessionsDriveFolderId: "",
};

const toStr = (n?: number) => (n != null ? String(n) : "");

/** Prefill for edit. Drive links now come back on admin GETs, so they populate; a course
 *  with only one tier priced (migrated data) leaves the other tier's inputs blank. */
export function courseToFormValues(c: AdminCourse): CourseFormValues {
  const sessions = c.pricing?.mocksessions_only;
  const lectures = c.pricing?.mocksession_and_lectures;
  return {
    title: c.title ?? "",
    description: c.description ?? "",
    sessionsMonthly: toStr(sessions?.monthly),
    sessionsQuarterly: toStr(sessions?.quarterly),
    lecturesMonthly: toStr(lectures?.monthly),
    lecturesQuarterly: toStr(lectures?.quarterly),
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

/** Build the API payload. Empty price → interval omitted (not offered). A tier with no
 *  prices at all → tier key omitted, so a PATCH merge keeps the stored values. Empty Drive
 *  link → omitted, same reason. */
export function buildCoursePayload(v: CourseFormValues): CourseInput {
  const payload: CourseInput = {
    title: v.title.trim(),
    description: v.description.trim(),
  };

  const pricing: CoursePricing = {};

  const sessionsMonthly = parsePrice(v.sessionsMonthly);
  const sessionsQuarterly = parsePrice(v.sessionsQuarterly);
  if (sessionsMonthly != null || sessionsQuarterly != null) {
    pricing.mocksessions_only = {
      ...(sessionsMonthly != null && { monthly: sessionsMonthly }),
      ...(sessionsQuarterly != null && { quarterly: sessionsQuarterly }),
    };
  }

  const lecturesMonthly = parsePrice(v.lecturesMonthly);
  const lecturesQuarterly = parsePrice(v.lecturesQuarterly);
  if (lecturesMonthly != null || lecturesQuarterly != null) {
    pricing.mocksession_and_lectures = {
      ...(lecturesMonthly != null && { monthly: lecturesMonthly }),
      ...(lecturesQuarterly != null && { quarterly: lecturesQuarterly }),
    };
  }

  if (Object.keys(pricing).length > 0) payload.pricing = pricing;

  const lectures = v.lecturesDriveFolderId.trim();
  const mockSessions = v.mockSessionsDriveFolderId.trim();
  if (lectures) payload.lecturesDriveFolderId = lectures;
  if (mockSessions) payload.mockSessionsDriveFolderId = mockSessions;

  return payload;
}
