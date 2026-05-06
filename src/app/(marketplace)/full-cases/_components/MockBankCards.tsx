import Link from "next/link";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { MdApps, MdOutlineAir } from "react-icons/md";
import { PiBoneLight } from "react-icons/pi";
import { RiBrainFill } from "react-icons/ri";
import { slugify } from "@/lib/slug";
import type { Specialty } from "@/types/api";

const cardIcons = [
  <FaRegHeart key="heart" className="size-7 text-[#5E5E5E]" />,
  <MdOutlineAir key="air" className="size-7 text-[#5E5E5E]" />,
  <IoWaterOutline key="water" className="size-7 text-[#5E5E5E]" />,
  <RiBrainFill key="brain" className="size-7 text-[#5E5E5E]" />,
  <FaUser key="user" className="size-7 text-[#5E5E5E]" />,
  <PiBoneLight key="bone" className="size-7 text-[#5E5E5E]" />,
];

const cardIconColors = [
  "#FFE6F5CC",
  "#E6F3FFCC",
  "#FDFCE5CC",
  "#E6FEE9CC",
  "#E6FBFDCC",
  "#EFE6FFCC",
  "#FFE6E6CC",
  "#FFF4E6CC",
];

const cardClass =
  "border-[0.2px] p-3 sm:p-4 rounded-[16px] gap-3 sm:gap-4 bg-white border-gray-2 questionBankShadow flex items-center hover:scale-105";

export default function MockCasesCards({
  specialties,
}: {
  specialties: Specialty[];
}) {
  if (specialties.length === 0) {
    return (
      <p className="col-span-full text-center text-subtle-text py-12">
        No specialties available right now. Please check back later.
      </p>
    );
  }

  const totalCases = specialties.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      <Link href="/full-cases/all" className={cardClass}>
        <aside
          style={{ backgroundColor: "#EEE9F7" }}
          className="flex rounded-full p-4"
        >
          <MdApps className="size-7 text-primary-100" />
        </aside>
        <aside className="space-y-0.5">
          <p className="font-semibold text-base sm:text-lg leading-[120%] tracking-[-2%] text-black-others">
            All Cases
          </p>
          <p className="text-sm text-subtle-text leading-[150%]">
            {totalCases} {totalCases === 1 ? "Case" : "Cases"}
          </p>
        </aside>
      </Link>

      {specialties.map((item, idx) => {
        const bg = cardIconColors[idx % cardIconColors.length];
        const icon = cardIcons[idx % cardIcons.length];
        const slug = slugify(item.specialty);

        return (
          <Link
            href={`/full-cases/${slug}`}
            key={item.specialty}
            className={cardClass}
          >
            <aside
              style={{ backgroundColor: bg }}
              className="flex rounded-full p-4"
            >
              {icon}
            </aside>
            <aside className="space-y-0.5">
              <p className="font-semibold text-base sm:text-lg leading-[120%] tracking-[-2%] text-black-others">
                {item.specialty}
              </p>
              <p className="text-sm text-subtle-text leading-[150%]">
                {item.count} {item.count === 1 ? "Case" : "Cases"}
              </p>
            </aside>
          </Link>
        );
      })}
    </>
  );
}
