import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";
import { getSessionUser } from "@/lib/current-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  // Authenticated but not an admin → send back to the member area.
  if (user.role !== "admin") redirect("/dashboard");

  return <AdminShell user={user}>{children}</AdminShell>;
}
