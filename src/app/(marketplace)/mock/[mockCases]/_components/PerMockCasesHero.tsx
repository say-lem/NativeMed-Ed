import { BannerTitleCase } from "@/components/shared/TitleCase";
import BackIcon from "./BackSvg";
import MockHeaderBg from "./MockHeaderBg";

export default function PerMockCasesHero({
  Params,
}: {
  Params: { mockCases: string };
}) {
  return (
    <MockHeaderBg>
      <div className="self-start">
        <BackIcon />
      </div>
      <BannerTitleCase text={Params.mockCases} />
    </MockHeaderBg>
  );
}
