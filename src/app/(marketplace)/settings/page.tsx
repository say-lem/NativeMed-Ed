import { redirect } from "next/navigation";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import SettingsForm from "@/components/shared/SettingsForm";
import {
  changePasswordAction,
  logoutAllAction,
  updateProfileAction,
} from "./actions";
import { getSessionUser } from "@/lib/current-user";

export default async function SettingsPage() {
  const user = await getSessionUser();
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
