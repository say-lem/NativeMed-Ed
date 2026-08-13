import { redirect } from "next/navigation";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import SettingsForm from "@/components/shared/SettingsForm";
import {
  changePasswordAction,
  logoutAllAction,
  updateProfileAction,
} from "./actions";
import { getFreshUser } from "@/lib/fresh-profile";

export default async function SettingsPage() {
  // Fresh from /auth/me, not the cached cookie — the cookie predates telegramUsername /
  // examSitting on older sessions and would render them blank.
  const user = await getFreshUser();
  if (!user) redirect("/login");

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Settings" />
      </BannerBg>
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
    </>
  );
}
