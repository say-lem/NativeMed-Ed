import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import AdminSearchInput from "../../_components/AdminSearchInput";

export default function AdminLiveCoursesHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Live Courses" />
        <AdminSearchInput placeholder="Search live courses..." />
      </BannerBg>
    </section>
  );
}
