import { CircleCheck } from "lucide-react";
import Link from "next/link";

function TimerSvg() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.25 1.125H6.75V2.625H11.25V1.125ZM8.25 10.875H9.75V6.375H8.25V10.875ZM14.2725 5.9175L15.3375 4.8525C15.015 4.47 14.6625 4.11 14.28 3.795L13.215 4.86C12.0525 3.93 10.59 3.375 9 3.375C5.2725 3.375 2.25 6.3975 2.25 10.125C2.25 13.8525 5.265 16.875 9 16.875C12.735 16.875 15.75 13.8525 15.75 10.125C15.75 8.535 15.195 7.0725 14.2725 5.9175ZM9 15.375C6.0975 15.375 3.75 13.0275 3.75 10.125C3.75 7.2225 6.0975 4.875 9 4.875C11.9025 4.875 14.25 7.2225 14.25 10.125C14.25 13.0275 11.9025 15.375 9 15.375Z"
        fill="#6F6F6F"
      />
    </svg>
  );
}

export default function DifferentMockCases({
  parentPage,
}: {
  parentPage: string;
}) {
  const mockCases = [
    {
      id: 1,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Completed",
    },
    {
      id: 2,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Not Started",
    },
    {
      id: 3,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "In Progress",
    },
    {
      id: 4,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Not Started",
    },
    {
      id: 5,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Not Started",
    },
    {
      id: 6,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "In Progress",
    },
    {
      id: 7,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Not Started",
    },
    {
      id: 8,
      title: "Station 1: Chest Pain in 57 Year Old",
      duration: 15,
      status: "Completed",
    },
  ];

  const renderMockCases = () => {
    return mockCases.map((mockCase) => {
      return (
        <Link
          href={`/mock/${parentPage}/${mockCase.id}`}
          key={mockCase.id}
          className="flex justify-between border-b-[0.5px] px-2 sm:px-4 py-4 sm:py-6 border-gray-2 gap-4"
        >
          <aside className="space-y-2">
            <h2 className="font-semibold text-sm md:text-lg leading-[120%] tracking-[-2%] text-black-others">
              {mockCase.title}
            </h2>
            <p className="flex items-center gap-1 text-subtle-text text-sm leading-[150%]">
              <TimerSvg />
              <span> {mockCase.duration} mins</span>
            </p>
          </aside>
          <aside>
            <p
              className={`text-xs sm:text-sm leading-[150%] ${mockCase.status === "In Progress" ? "text-[#D19E08]" : mockCase.status === "Completed" ? "text-[#00A63D] " : "text-black-others"}`}
            >
              {mockCase.status === "Completed" ? (
                <span className="flex items-center gap-1">
                  <CircleCheck size={20} /> {mockCase.status}
                </span>
              ) : (
                mockCase.status
              )}
            </p>
          </aside>
        </Link>
      );
    });
  };

  return <>{renderMockCases()}</>;
}
