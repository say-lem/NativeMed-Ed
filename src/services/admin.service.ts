import "server-only";
import { api } from "@/lib/api";
import type {
  AdminDashboardStats,
  ApiResponse,
  CreateAdminInput,
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

/** GET /auth/admin/users — admin only. Paginated list of ALL users, admins included.
 *  (Not `/admin/users` — that one's role:"user"-only, used only by the dashboard's
 *  "Users" stat, which intentionally counts registrants, not staff.) */
export async function getAdminUsers(
  page = 1,
  limit = 50,
): Promise<ApiResponse<Paginated<User>>> {
  const res = await api.get<ApiResponse<Paginated<User>>>("/auth/admin/users", {
    params: { page, limit },
  });
  return res.data;
}

/** POST /auth/admin/users — admin only. Creates a new admin account and emails them a
 *  temporary password (auto-generated if `temporaryPassword` is omitted); they're forced
 *  to change it on first login. */
export async function createAdmin(
  input: CreateAdminInput,
): Promise<ApiResponse<User>> {
  const res = await api.post<ApiResponse<User>>("/auth/admin/users", input);
  return res.data;
}

/** PATCH /auth/admin/users/:userId/toggle-status — admin only. Activate/deactivate a user.
 *  403s if the target account is itself an admin — that's blocked backend-side. */
export async function toggleUserStatus(
  userId: string,
): Promise<ApiResponse<User>> {
  const res = await api.patch<ApiResponse<User>>(
    `/auth/admin/users/${userId}/toggle-status`,
  );
  return res.data;
}
