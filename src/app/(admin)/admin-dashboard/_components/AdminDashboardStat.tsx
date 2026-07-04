"use client";
import Link from "next/link";
import { toast } from "sonner";
import { StatFolderIcon, StatPlusIcon, StatVideoIcon } from "./StatIcons";
import type { AdminDashboardStats } from "@/types/api";

const btnClass =
  "rounded-[8px] border border-gray-1 py-3 px-4 cursor-pointer flex items-center gap-2 hover:bg-[#2D135C] group";

function BtnInner({
  Icon,
  text,
}: {
  Icon: (props: { className?: string }) => React.JSX.Element;
  text: string;
}) {
  return (
    <>
      <Icon className="text-[#6F6F6F] group-hover:text-white" />
      <span className="text-black leading-[130%] font-medium text-sm tracking-[-2%] group-hover:text-white">
        {text}
      </span>
    </>
  );
}

export default function AdminDashboardStat({
  stats,
}: {
  stats?: AdminDashboardStats;
}) {
  const cards = [
    { name: "Users", count: stats?.totalUsers ?? 0 },
    { name: "Subscribers", count: stats?.activeSubscriptions ?? 0 },
    { name: "Enrollments", count: stats?.totalEnrollments ?? 0 },
    { name: "Courses", count: stats?.totalCourses ?? 0 },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div
            key={stat.name}
            className="border-[0.5px] border-[#E0E0E0] p-5 rounded-[8px] adminCardShadow flex flex-col gap-1.5"
          >
            <p className="text-subtle-text font-medium text-sm leading-[130%]">
              {stat.name}
            </p>
            <h3 className="text-black text-4xl tracking-[-2%] font-semibold leading-[130%]">
              {stat.count.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="my-10 sm:my-16 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <Link href="/admin-casebank/upload-casebank" className={btnClass}>
          <BtnInner Icon={StatPlusIcon} text="Add Case to Bank" />
        </Link>
        <Link href="/admin-courses/upload-course" className={btnClass}>
          <BtnInner Icon={StatFolderIcon} text="Create Course" />
        </Link>
        <button
          type="button"
          onClick={() => toast("Coming soon")}
          className={btnClass}
        >
          <BtnInner Icon={StatVideoIcon} text="Schedule Live Class" />
        </button>
      </div>
    </section>
  );
}
