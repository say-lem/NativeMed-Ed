import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function AdminHomepageHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Homepage" />
      </BannerBg>
    </section>
  );
}
