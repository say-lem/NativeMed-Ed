import { redirect } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { getOptionalUser } from "@/lib/current-user";
import { safeRedirect } from "@/lib/redirect";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  // Already signed in? Don't show the register form — send them on.
  const user = await getOptionalUser();
  if (user) {
    const fallback = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    redirect(safeRedirect(redirectTo, fallback));
  }

  return <AuthForm mode="register" redirectTo={redirectTo} />;
}
