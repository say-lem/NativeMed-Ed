import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function AdminSettingsHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Settings" />
      </BannerBg>
    </section>
  );
}
