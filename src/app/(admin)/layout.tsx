import axios from "axios";
import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";
import { me } from "@/services/auth.service";
import type { User } from "@/types/api";

async function loadUser(): Promise<User | null> {
  try {
    const response = await me();
    if (!response.success) return null;
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    throw err;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await loadUser();
  if (!user) redirect("/login");
  // Authenticated but not an admin → send back to the member area.
  if (user.role !== "user") redirect("/dashboard");

  return <AdminShell user={user}>{children}</AdminShell>;
}
