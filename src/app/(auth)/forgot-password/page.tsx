import { redirect } from "next/navigation";
import ForgotPasswordForm from "@/components/shared/ForgotPasswordForm";
import { getOptionalUser } from "@/lib/current-user";

export default async function ForgotPassword() {
  const user = await getOptionalUser();
  if (user) {
    redirect(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
  }

  return <ForgotPasswordForm />;
}
