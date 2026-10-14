import "server-only";
import { cache } from "react";
import axios, { type AxiosError } from "axios";
import { getAccessToken } from "@/lib/session";
import { me } from "@/services/auth.service";
import type { User } from "@/types/api";

// Decoding a JWT does not verify its signature. Authorize using the backend,
// with request-scoped deduplication so layouts and pages share one lookup.
export const getSessionUser = cache(async (): Promise<User | null> => {
  if (!(await getAccessToken())) return null;
  try {
    const response = await me();
    if (!response.success || response.data.isActive === false) return null;
    return response.data;
  } catch (err) {
    // Only fail closed (treat as logged out) when the backend actually
    // rejected the token. A rate limit / 5xx / cold-start timeout is not
    // proof the session is invalid — `api.ts` marks that case explicitly
    // because its status is otherwise indistinguishable from a real 401 —
    // so let it propagate to the route's error.tsx (retry card) instead of
    // bouncing a valid session to /login.
    if (axios.isAxiosError(err) && !(err as AxiosError & { authUnavailable?: boolean }).authUnavailable) {
      const status = err.response?.status;
      if (status === 401 || status === 403) return null;
    }
    throw err;
  }
});

/** Best-effort — used by public pages for auth-aware CTAs, where "can't tell
 *  right now" should degrade to "render as logged out", never crash the page. */
export const getOptionalUser = cache(async (): Promise<User | null> => {
  try {
    return await getSessionUser();
  } catch {
    return null;
  }
});
