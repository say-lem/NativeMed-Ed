import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import AdminSearchInput from "../../_components/AdminSearchInput";

export default function AdminSubHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Subscribers" />
        <AdminSearchInput placeholder="Search subscribers..." />
      </BannerBg>
    </section>
  );
}
