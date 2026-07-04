import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import AdminSearchInput from "../../_components/AdminSearchInput";

export default function AdminCoursesHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Courses" />
        <AdminSearchInput placeholder="Search courses..." />
      </BannerBg>
    </section>
  );
}
