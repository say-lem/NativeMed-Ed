import Link from "next/link";
import type { Case } from "@/types/api";

const DEFAULT_DURATION_MIN = 15;

const difficultyClass: Record<Case["difficulty"], string> = {
  easy: "text-[#00A63D]",
  medium: "text-[#D19E08]",
  hard: "text-[#D70117]",
};

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

function genderInitial(gender: Case["patientData"]["gender"]): string {
  return gender === "female" ? "F" : "M";
}

export default function DifferentMockCases({
  cases,
  parentSlug,
  showSpecialty = false,
}: {
  cases: Case[];
  parentSlug: string;
  showSpecialty?: boolean;
}) {
  if (cases.length === 0) {
    return (
      <p className="text-center text-subtle-text py-12">
        No cases available in this section yet.
      </p>
    );
  }

  return (
    <>
      {cases.map((c) => {
        const patient = `${c.patientData.name}, ${c.patientData.age}${genderInitial(c.patientData.gender)}`;
        const subtitle = `Station ${c.stationNumber} · ${patient}`;

        return (
          <Link
            href={`/full-cases/${parentSlug}/${c._id}`}
            key={c._id}
            className="flex justify-between border-b-[0.5px] px-2 sm:px-4 py-4 sm:py-6 border-gray-2 gap-4"
          >
            <aside className="space-y-1.5 sm:space-y-2 min-w-0">
              <h2 className="font-semibold text-sm md:text-lg leading-[120%] tracking-[-2%] text-black-others line-clamp-2">
                {c.title}
              </h2>
              <p className="text-xs sm:text-sm text-subtle-text leading-[150%] line-clamp-1">
                {subtitle}
              </p>
              <p className="flex items-center gap-1 text-subtle-text text-sm leading-[150%]">
                <TimerSvg />
                <span>{DEFAULT_DURATION_MIN} mins</span>
              </p>
            </aside>
            <aside className="shrink-0">
              {showSpecialty ? (
                <p className="text-xs sm:text-sm leading-[150%] text-primary-100 font-semibold">
                  {c.specialty}
                </p>
              ) : (
                <p
                  className={`text-xs sm:text-sm capitalize leading-[150%] ${difficultyClass[c.difficulty] ?? "text-black-others"}`}
                >
                  {c.difficulty}
                </p>
              )}
            </aside>
          </Link>
        );
      })}
    </>
  );
}
