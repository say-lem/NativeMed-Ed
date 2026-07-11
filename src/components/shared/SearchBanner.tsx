"use client";
import { IoSearchSharp } from "react-icons/io5";
import { X } from "lucide-react";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";

/** Purple banner with a controlled, working search box. Reused by list browsers. */
export default function SearchBanner({
  title,
  placeholder,
  value,
  onChange,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <BannerBg color="#2D135C">
      <BannerTitleCase text={title} />
      <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] border-[#D6D6D64F] items-center">
        <IoSearchSharp className="size-5 sm:size-6 text-white shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 outline-0 w-full text-sm sm:text-base text-white bg-transparent placeholder:text-[#B7B7B98C]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 text-white/70 hover:text-white cursor-pointer"
          >
            <X className="size-4 sm:size-5" />
          </button>
        )}
      </div>
    </BannerBg>
  );
}
