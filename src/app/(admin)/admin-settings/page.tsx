import { redirect } from "next/navigation";
import AdminSettingsHero from "./_components/AdminSettingsHero";
import SettingsForm from "@/components/shared/SettingsForm";
import {
  changePasswordAction,
  logoutAllAction,
  updateProfileAction,
} from "./actions";
import { getFreshUser } from "@/lib/fresh-profile";

export default async function AdminSettingsPage() {
  // Fresh from /auth/me — see the note in lib/fresh-profile.ts.
  const user = await getFreshUser();
  if (!user) redirect("/login");

  return (
    <section>
      <AdminSettingsHero />
      <SettingsForm
        initialProfile={{
          fullName: user.fullName,
          phone: user.phone,
          telegramUsername: user.telegramUsername ?? "",
          examSitting: user.examSitting ?? "",
        }}
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
