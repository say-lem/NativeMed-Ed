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
    return res.success ? res.data.items : [];
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
