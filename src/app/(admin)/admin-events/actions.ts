"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  createActivity,
  setActivityPublished,
  updateActivity,
  deleteActivity,
} from "@/services/activities.service";
import { activitySchema, activityPayload, type ActivityValues } from "@/lib/schemas/activity";
import type { ApiFailure, FormActionResult } from "@/types/api";

function fail(err: unknown, tag: string, fallback: string): FormActionResult {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiFailure | undefined;
    console.error(`[${tag}] axios error:`, err.code, err.message);
    return { ok: false, message: data?.message ?? fallback, fieldErrors: data?.errors };
  }
  console.error(`[${tag}] unexpected error:`, err);
  return { ok: false, message: "Something went wrong." };
}

/** Post a new event. */
export async function createActivityAction(
  values: ActivityValues,
): Promise<FormActionResult> {
  const parsed = activitySchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await createActivity(activityPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-events");
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin-dashboard");
    return { ok: true, message: "Event posted" };
  } catch (err) {
    return fail(err, "createActivityAction", "Couldn't post the event.");
  }
}

/** Edit an existing event. */
export async function updateActivityAction(
  id: string,
  values: ActivityValues,
): Promise<FormActionResult> {
  const parsed = activitySchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await updateActivity(id, activityPayload(parsed.data));
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-events");
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin-dashboard");
    return { ok: true, message: "Event updated" };
  } catch (err) {
    return fail(err, "updateActivityAction", "Couldn't update the event.");
  }
}

/** Delete an event. */
export async function deleteActivityAction(id: string): Promise<FormActionResult> {
  try {
    const res = await deleteActivity(id);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-events");
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin-dashboard");
    return { ok: true, message: "Event deleted" };
  } catch (err) {
    return fail(err, "deleteActivityAction", "Couldn't delete the event.");
  }
}

export async function setActivityPublishedAction(id: string, isPublished: boolean): Promise<FormActionResult> {
  try {
    const res = await setActivityPublished(id, isPublished);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-events");
    revalidatePath("/admin-dashboard");
    revalidatePath("/events");
    revalidatePath("/");
    return { ok: true, message: isPublished ? "Event published" : "Event archived and unpublished" };
  } catch (err) {
    return fail(err, "setActivityPublishedAction", "Couldn't change event visibility.");
  }
}
