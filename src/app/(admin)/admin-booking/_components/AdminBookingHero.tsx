import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function AdminBookingHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="1-on-1 Bookings" />
      </BannerBg>
    </section>
  );
}
