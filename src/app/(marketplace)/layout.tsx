import { redirect } from "next/navigation";
import MarketplaceShell from "./_components/MarketplaceShell";
import { getSessionUser } from "@/lib/current-user";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  // Admins get their own dashboard — mirrors the admin layout's symmetric
  // check, which sends non-admins out of the admin area to /dashboard.
  if (user.role === "admin") redirect("/admin-dashboard");

  return <MarketplaceShell user={user}>{children}</MarketplaceShell>;
}
