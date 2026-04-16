import { use } from "react";
import MockHeaderBg from "./_components/MockHeaderBg";
import BackIcon from "./_components/BackSvg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import { IoSearchSharp } from "react-icons/io5";
import DifferentMockCases from "./_components/DifferentMockCases";

export default function PerMockCasesHero({
  params,
}: {
  params: Promise<{ mockCases: string }>;
}) {
  const { mockCases } = use(params);

  return (
    <>
      <MockHeaderBg>
        <div className="self-start">
          <BackIcon />
        </div>
        <BannerTitleCase text={mockCases} />

        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-5 sm:size-6 text-white" />
          <input
            type="text"
            placeholder={`Search ${mockCases} cases...`}
            className="border-0 outline-0 w-full text-sm sm:text-base text-white"
          />
        </div>
      </MockHeaderBg>

      <div className="px-8 space-x-2.5 py-6 ">
        <DifferentMockCases parentPage={mockCases} />
      </div>
    </>
  );
}
