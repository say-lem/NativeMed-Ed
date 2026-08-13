"use server";

import { redirect } from "next/navigation";
import { clearSession, clearProfile, getRefreshToken } from "@/lib/session";
import { logout } from "@/services/auth.service";

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await logout(refreshToken);
    } catch {
      // Backend logout failed — proceed with local clear anyway.
    }
  }
  await clearSession();
  await clearProfile();
  // Home, not /login — a logged-out user has finished, not been kicked out mid-task.
  redirect("/");
}
