import { use } from "react";
import MockHeaderBg from "../_components/MockHeaderBg";
import BackIcon from "../_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import MocKCasesNavState from "./_components/MockCasesNavState";
import { GetRandomColor } from "../../_components/GetRandomColor";

export default function ViewMockCases({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const color = GetRandomColor();

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={id} />
      </MockHeaderBg>

      <section className="px-8 py-4 ">
        <MocKCasesNavState color={color} />
      </section>
    </>
  );
}
