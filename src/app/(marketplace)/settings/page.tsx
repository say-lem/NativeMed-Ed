import axios from "axios";
import { redirect } from "next/navigation";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import SettingsForm from "@/components/shared/SettingsForm";
import {
  changePasswordAction,
  logoutAllAction,
  updateProfileAction,
} from "./actions";
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

export default async function SettingsPage() {
  const user = await loadUser();
  if (!user) redirect("/login");

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Settings" />
      </BannerBg>
      <SettingsForm
        initialProfile={{ fullName: user.fullName, phone: user.phone }}
        email={user.email}
        actions={{
          updateProfileAction,
          changePasswordAction,
          logoutAllAction,
        }}
      />
    </>
  );
}
