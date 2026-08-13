import { Suspense } from "react";
import axios from "axios";
import AdminUsersHero from "./_components/AdminUsersHero";
import Users from "./_components/Users";
import UsersSkeleton from "./_components/UsersSkeleton";
import { getAdminUsers } from "@/services/admin.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { User } from "@/types/api";

async function loadUsers(): Promise<User[]> {
  try {
    const res = await getAdminUsers();
    if (!res.success) return [];

    // TEMP probe (2026-08-13): does GET /admin/users actually return telegramUsername and
    // examSitting? The new Telegram/Exam columns read them. Remove once confirmed.
    const items = res.data.items;
    console.log(
      "[admin-users] keys on first user:",
      items[0] ? Object.keys(items[0]) : "(no users)",
    );
    console.log(
      "[admin-users] telegram/exam per user:",
      items.map((u) => ({
        name: u.fullName,
        telegram: u.telegramUsername ?? "(absent)",
        exam: u.examSitting ?? "(absent)",
      })),
    );

    return items;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function UsersData() {
  const users = await loadUsers();
  return <Users users={users} />;
}

export default function AdminUsersPage() {
  return (
    <AdminListProvider>
      <section>
        <AdminUsersHero />
        <Suspense fallback={<UsersSkeleton />}>
          <UsersData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
