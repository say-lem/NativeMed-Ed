import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import BackIcon from "@/app/(marketplace)/full-cases/[cases]/_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";

export default function UploadLiveCourseHero({
  mode = "add",
}: {
  mode?: "add" | "edit";
}) {
  return (
    <BannerBg color="#2D135C">
      <div className="absolute left-10">
        <BackIcon />
      </div>
      <BannerTitleCase
        text={mode === "edit" ? "Edit Live Course" : "Upload New Live Course"}
      />
    </BannerBg>
  );
}
