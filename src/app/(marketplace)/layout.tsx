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

  return <MarketplaceShell user={user}>{children}</MarketplaceShell>;
}
