import axios from "axios";
import { redirect } from "next/navigation";
import AdminSettingsHero from "./_components/AdminSettingsHero";
import SettingsForm from "./_components/SettingsForm";
import { me } from "@/services/auth.service";
import type { User } from "@/types/api";

async function loadUser(): Promise<User | null> {
  try {
    const res = await me();
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    throw err;
  }
}

export default async function AdminSettingsPage() {
  const user = await loadUser();
  if (!user) redirect("/login");

  return (
    <section>
      <AdminSettingsHero />
      <SettingsForm
        initialProfile={{ fullName: user.fullName, phone: user.phone }}
        email={user.email}
      />
    </section>
  );
}
