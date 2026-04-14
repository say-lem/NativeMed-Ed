import { BannerTitleCase } from "@/components/shared/titleCase";
import { IoSearchSharp } from "react-icons/io5";

export default function SubHero() {
  return (
    <section>
      <div className="bg-[#2D135C] py-8 gap-2 flex-col flex items-center justify-center">
        {/* banner  */}
        <BannerTitleCase text="Subscriptions" />
        <div className="w-[50%] rounded-[8px] flex gap-2.5  py-3 px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
          <IoSearchSharp className="size-6 text-white" />
          <input
            type="text"
            placeholder="Search Cases..."
            className="border-0 outline-0 w-full"
          />
        </div>
      </div>
    </section>
  );
}
