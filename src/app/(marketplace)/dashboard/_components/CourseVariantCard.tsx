import Image from "next/image";
import { ArrowRight } from "lucide-react";

export type CourseTag = "Mock" | "Course";

export type CourseItem = {
  id: number;
  tag: CourseTag;
  title: string;
  img: string;
};

export default function CourseVariantCard({ item }: { item: CourseItem }) {
  const cta = item.tag === "Course" ? "Continue learning" : "Start Practicing";
  return (
    <div className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col">
      <div className="relative w-full h-40 sm:h-44">
        <Image src={item.img} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-[#00000080] border-[0.2px] border-white/80 text-primary-white text-xs font-semibold leading-none">
          {item.tag}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-base font-semibold text-black-others leading-[130%] line-clamp-2">
          {item.title}
        </p>
        <div className="mt-auto">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-primary-100 text-primary-100 text-sm font-semibold px-5 py-2 cursor-pointer hover:bg-primary-10"
          >
            {cta} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
