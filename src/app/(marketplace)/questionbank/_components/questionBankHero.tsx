import { BannerTitleCase } from "@/components/shared/TitleCase";
import { IoSearchSharp } from "react-icons/io5";
import QuestionBankCards from "../QuestionBankCard";
import BannerBg from "../../_components/BannerBg";

export default function QuestionBankHero() {
  return (
    <section>
      <BannerBg color={"#2D135C"}>
        <BannerTitleCase text="Question Bank" />
        <div className="w-[50%] rounded-[8px] flex gap-2.5  py-3 px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-6 text-white" />
          <input
            type="text"
            placeholder="Search Cases..."
            className="border-0 outline-0 w-full"
          />
        </div>
      </BannerBg>

      <div className="px-10 grid grid-cols-3 gap-4 py-8">
        <QuestionBankCards />
      </div>
    </section>
  );
}
