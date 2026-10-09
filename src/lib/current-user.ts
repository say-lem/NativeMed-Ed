import "server-only";
import { cache } from "react";
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
  } catch {
    // Fail closed, including when the identity service is unavailable.
    return null;
  }
});

export const getOptionalUser = getSessionUser;
