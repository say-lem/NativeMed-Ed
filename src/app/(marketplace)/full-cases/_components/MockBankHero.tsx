import axios from "axios";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import { IoSearchSharp } from "react-icons/io5";
import BannerBg from "../../_components/BannerBg";
import MockCasesCards from "./MockBankCards";
import { getSpecialties } from "@/services/cases.service";
import type { Specialty } from "@/types/api";

async function loadSpecialties(): Promise<Specialty[]> {
  try {
    const res = await getSpecialties();
    return res.success ? res.data : [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        "[MockBankHero] failed to fetch specialties:",
        err.code,
        err.message,
      );
    } else {
      console.error("[MockBankHero] unexpected error:", err);
    }
    return [];
  }
}

export default async function MockBankHero() {
  const specialties = await loadSpecialties();

  return (
    <section>
      <BannerBg color={"#2D135C"}>
        <BannerTitleCase text="Case Bank" />
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
        <MockCasesCards specialties={specialties} />
      </div>
    </section>
  );
}
