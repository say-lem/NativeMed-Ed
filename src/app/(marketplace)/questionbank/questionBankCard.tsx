import Link from "next/link";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { MdOutlineAir } from "react-icons/md";
import { PiBoneLight } from "react-icons/pi";
import { RiBrainFill } from "react-icons/ri";

const cardIcons = [
  <FaRegHeart key="heart" className="size-7 text-[#5E5E5E]" />,
  <MdOutlineAir key="air" className="size-7 text-[#5E5E5E]" />,
  <IoWaterOutline key="water" className="size-7 text-[#5E5E5E]" />,
  <RiBrainFill key="brain" className="size-7 text-[#5E5E5E]" />,
  <FaUser key="user" className="size-7 text-[#5E5E5E]" />,
  <PiBoneLight key="bone" className="size-7 text-[#5E5E5E]" />,
];

const bgColors = [
  "#FFE6F5CC",
  "#E6F3FFCC",
  "#FDFCE5CC",
  "#E6FEE9CC",
  "#E6FBFDCC",
  "#EFE6FFCC",
  "#FFE6E6CC",
  "#FFF4E6CC",
];

const questionBank = [
  { id: 1, title: "Cardiology", num: 150 },
  { id: 2, title: "Neurology", num: 150 },
  { id: 3, title: "Endocrine", num: 150 },
  { id: 4, title: "MusculoSkeletal", num: 150 },
  { id: 5, title: "Psychiatry", num: 150 },
  { id: 6, title: "Dermatology", num: 150 },
  { id: 7, title: "Gastroenterology", num: 150 },
  { id: 8, title: "Dermatology", num: 150 },
];

export default function QuestionBankCards() {
  return questionBank.map((item) => {
    const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const icon = cardIcons[Math.floor(Math.random() * cardIcons.length)];
    return (
      <Link
        href={"#"}
        key={item.id}
        className="border-[0.2px] p-4 rounded-[16px] gap-4 bg-white border-gray2 questionBankShadow flex items-center hover:scale-105"
      >
        <aside
          style={{ backgroundColor: bg }}
          className="flex rounded-full p-4"
        >
          {icon}
        </aside>
        <aside className="space-y-0.5">
          <p className="font-semibold text-lg leading-[120%] tracking-[-2%] text-blackOthers">
            {item.title}
          </p>
          <p className="text-sm text-Subtle-text leading-[150%]">
            {item.num} Cases
          </p>
        </aside>
      </Link>
    );
  });
}
