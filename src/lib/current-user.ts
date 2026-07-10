import "server-only";
import axios from "axios";
import { getAccessToken } from "@/lib/session";
import { me } from "@/services/auth.service";
import type { User } from "@/types/api";

/** The signed-in user, or null if not authenticated. Never throws. */
export async function getOptionalUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await me();
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    return null;
  }
}
