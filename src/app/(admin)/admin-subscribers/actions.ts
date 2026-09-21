"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import {
  manualGrantCaseBank,
  pauseCaseBankPayments,
  resumeCaseBankPayments,
  restoreCaseBankAccess,
  revokeCaseBankAccess,
} from "@/services/subscriptions.service";
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

export async function grantCaseBankAccessAction(
  userId: string,
  durationDays: number,
): Promise<FormActionResult> {
  if (!userId) return { ok: false, message: "Pick a user." };
  try {
    const res = await manualGrantCaseBank(userId, durationDays);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-subscribers");
    return { ok: true, message: "Case Bank access granted" };
  } catch (err) {
    return fail(err, "grantCaseBankAccessAction", "Couldn't grant access.");
  }
}

export async function revokeCaseBankAccessAction(userId: string): Promise<FormActionResult> {
  if (!userId) return { ok: false, message: "Pick a user." };
  try {
    const res = await revokeCaseBankAccess(userId);
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-subscribers");
    return { ok: true, message: "Case Bank access revoked" };
  } catch (err) {
    return fail(err, "revokeCaseBankAccessAction", "Couldn't revoke access.");
  }
}

export async function restoreCaseBankAccessAction(
  userId: string,
  durationDays: number,
): Promise<FormActionResult> {
  if (!userId) return { ok: false, message: "Pick a user." };
  try {
    const res = await restoreCaseBankAccess(userId, durationDays);
    if (!res.success) return { ok: false, message: res.message, fieldErrors: res.errors };
    revalidatePath("/admin-subscribers");
    return { ok: true, message: "Case Bank access restored" };
  } catch (err) {
    return fail(err, "restoreCaseBankAccessAction", "Couldn't restore access.");
  }
}

export async function pauseCaseBankPaymentsAction(): Promise<FormActionResult> {
  try {
    const res = await pauseCaseBankPayments();
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-subscribers");
    return { ok: true, message: "Payments paused for Case Bank" };
  } catch (err) {
    return fail(err, "pauseCaseBankPaymentsAction", "Couldn't pause payments.");
  }
}

export async function resumeCaseBankPaymentsAction(): Promise<FormActionResult> {
  try {
    const res = await resumeCaseBankPayments();
    if (!res.success) return { ok: false, message: res.message };
    revalidatePath("/admin-subscribers");
    return { ok: true, message: "Payments resumed for Case Bank" };
  } catch (err) {
    return fail(err, "resumeCaseBankPaymentsAction", "Couldn't resume payments.");
  }
}
