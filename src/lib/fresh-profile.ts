import "server-only";
import axios from "axios";
import { me } from "@/services/auth.service";
import { getSessionUser } from "@/lib/current-user";
import type { User } from "@/types/api";

/**
 * The signed-in user, read from `GET /auth/me` rather than the cached profile cookie.
 *
 * Layouts deliberately use the cookie (see lib/session.ts) to avoid calling `/auth/me` on
 * every render and tripping the backend's auth rate limiter. That's fine for display, but
 * wrong for the **settings form**: the cookie is written at login, so any field added since
 * — `telegramUsername` and `examSitting`, added 2026-08-12 — is missing from older sessions.
 * The form would render them blank and a save could wipe values the user never touched.
 *
 * One request per settings page visit is not a rate-limit concern. Falls back to the cached
 * profile if the call fails, so a flaky network degrades to stale data rather than a crash.
 */
export async function getFreshUser(): Promise<User | null> {
  const cached = await getSessionUser();

  try {
    const res = await me();
    if (res.success) return res.data;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error(
      "[fresh-profile] /auth/me failed, using cached profile:",
      err.response?.status ?? err.code,
    );
  }

  return cached;
}
