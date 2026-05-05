import { BannerTitleCase } from "@/components/shared/TitleCase";
import { IoSearchSharp } from "react-icons/io5";
import BannerBg from "../../_components/BannerBg";
import MockCasesCards from "./MockBankCards";

export default function MockBankHero() {
  return (
    <section>
      <BannerBg color={"#2D135C"}>
        <BannerTitleCase text="Mock Cases" />
        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-5 sm:size-6 text-white" />
          <input
            type="text"
            placeholder="Search Cases..."
            className="border-0 outline-0 w-full text-sm sm:text-base"
          />
        </div>
      </BannerBg>

      <div className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-6 sm:py-8">
        <MockCasesCards />
      </div>
    </section>
  );
}
