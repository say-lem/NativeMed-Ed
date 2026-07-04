import "server-only";
import { api } from "@/lib/api";
import type {
  AdminDashboardStats,
  ApiResponse,
  Paginated,
  User,
} from "@/types/api";

/** GET /admin/dashboard — admin only. Aggregate stats + recent activity. */
export async function getAdminDashboard(): Promise<
  ApiResponse<AdminDashboardStats>
> {
  const res = await api.get<ApiResponse<AdminDashboardStats>>(
    "/admin/dashboard",
  );
  return res.data;
}

/** GET /admin/users — admin only. Paginated list of all registered users. */
export async function getAdminUsers(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<User>>> {
  const res = await api.get<ApiResponse<Paginated<User>>>("/admin/users", {
    params: { page, limit },
  });
  return res.data;
}
