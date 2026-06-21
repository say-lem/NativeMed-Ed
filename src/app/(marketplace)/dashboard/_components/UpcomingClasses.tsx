import Image from "next/image";
import { Clock, Calendar } from "lucide-react";

type UpcomingClass = {
  id: number;
  title: string;
  time: string;
  date: string;
  img: string;
};

const classes: UpcomingClass[] = [
  {
    id: 1,
    title: "1-on-1 Sessions with Dr Native (6 Cases)",
    time: "9:00am",
    date: "12th May, 2026",
    img: "/Images/coursesImage.png",
  },
  {
    id: 2,
    title: "Live Sessions with Dr Native",
    time: "9:00am",
    date: "12th May, 2026",
    img: "/Images/coursesImage.png",
  },
];

export default function UpcomingClasses() {
  return (
    <div className="rounded-[14px] border-[0.5px] border-[#E0E0E0] adminCardShadow bg-white p-5 space-y-4">
      <p className="text-base font-semibold text-black-others leading-[130%]">
        Upcoming Classes
      </p>

      <ul className="space-y-4">
        {classes.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative size-12 rounded-[8px] overflow-hidden shrink-0">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-black-others leading-[130%] line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-subtle-text">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {item.date}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
