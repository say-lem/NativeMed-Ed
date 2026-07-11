import { redirect } from "next/navigation";
import AdminSettingsHero from "./_components/AdminSettingsHero";
import SettingsForm from "@/components/shared/SettingsForm";
import {
  changePasswordAction,
  logoutAllAction,
  updateProfileAction,
} from "./actions";
import { getSessionUser } from "@/lib/current-user";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <section>
      <AdminSettingsHero />
      <SettingsForm
        initialProfile={{ fullName: user.fullName, phone: user.phone }}
        email={user.email}
        actions={{
          updateProfileAction,
          changePasswordAction,
          logoutAllAction,
        }}
      />
    </section>
  );
}
