import "server-only";
import { getSessionUser } from "@/lib/current-user";

// Session identity now comes from /auth/me, deduplicated within the render.
// Settings must never fall back to unsigned or stale profile-cookie data.
export const getFreshUser = getSessionUser;
