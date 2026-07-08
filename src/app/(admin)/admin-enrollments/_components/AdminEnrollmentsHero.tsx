import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import AdminSearchInput from "../../_components/AdminSearchInput";

export default function AdminEnrollmentsHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Enrollments" />
        <AdminSearchInput placeholder="Search enrollments..." />
      </BannerBg>
    </section>
  );
}
