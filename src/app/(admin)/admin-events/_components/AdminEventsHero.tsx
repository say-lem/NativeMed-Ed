import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import AdminSearchInput from "../../_components/AdminSearchInput";

export default function AdminEventsHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Events" />
        <AdminSearchInput placeholder="Search events..." />
      </BannerBg>
    </section>
  );
}
