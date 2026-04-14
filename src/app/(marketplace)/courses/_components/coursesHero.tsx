import { BannerTitleCase } from "@/components/shared/titleCase";
import { IoSearchSharp } from "react-icons/io5";
import BannerBg from "../../_components/bannerBg";

export default function CoursesHero() {
  return (
    <section>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Courses" />
        <div className="w-[50%] rounded-[8px] flex gap-2.5  py-3 px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-6 text-white" />
          <input
            type="text"
            placeholder="Search Courses..."
            className="border-0 outline-0 w-full"
          />
        </div>
      </BannerBg>
    </section>
  );
}
