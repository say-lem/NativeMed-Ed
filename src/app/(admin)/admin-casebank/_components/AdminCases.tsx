"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StatPlusIcon } from "../../admin-dashboard/_components/StatIcons";
import Link from "next/link";

type AdminCase = {
  stationNumber: number;
  title: string;
  specialty: string;
};

const cases: AdminCase[] = [
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Respiratory",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Respiratory",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
  {
    stationNumber: 3,
    title: "Chest Pain in 57-year-old",
    specialty: "Cardiology",
  },
];

const SPECIALTY_DOT: Record<string, string> = {
  Cardiology: "#E5187A",
  Respiratory: "#2F80ED",
};

const SPECIALTIES = [
  "All",
  ...Array.from(new Set(cases.map((c) => c.specialty))),
];

function EditIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0504 3.00002L4.20878 10.2417C3.95045 10.5167 3.70045 11.0584 3.65045 11.4334L3.34211 14.1333C3.23378 15.1083 3.93378 15.775 4.90045 15.6084L7.58378 15.15C7.95878 15.0834 8.48378 14.8084 8.74211 14.525L15.5838 7.28335C16.7671 6.03335 17.3004 4.60835 15.4588 2.86668C13.6254 1.14168 12.2338 1.75002 11.0504 3.00002Z"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9082 4.20898C10.2665 6.50898 12.1332 8.26732 14.4499 8.50065"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 18.334H17.5"
        stroke="#292D32"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminCases() {
  const [specialty, setSpecialty] = useState("All");

  const rows = cases.filter((c) =>
    specialty === "All" ? true : c.specialty === specialty,
  );

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      {/* Specialty filter + add case */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-[190px]">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="appearance-none w-full h-10 rounded-[4px] border-[0.5px] border-black px-4 py-2 pr-10 text-sm text-black bg-white cursor-pointer outline-none"
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black"
          />
        </div>

        <Link
          href="/admin-casebank/upload-casebank"
          className="rounded-[8px] border border-gray-1 py-3 px-4 cursor-pointer flex items-center gap-2 hover:bg-[#2D135C] group"
        >
          <StatPlusIcon className="text-[#6F6F6F] group-hover:text-white" />
          <span className="text-black leading-[130%] font-medium text-sm tracking-[-2%] group-hover:text-white">
            Add Case
          </span>
        </Link>
      </div>

      {/* Cases list */}
      <div className="mt-6">
        {rows.map((c, idx) => (
          <div
            key={`${c.stationNumber}-${idx}`}
            className="flex items-center justify-between gap-4 border-b border-[#EDEDED] py-5"
          >
            <div className="space-y-2 min-w-0">
              <p className="text-base leading-[120%] tracking-[-0.02em] text-black-others truncate">
                <span className="font-semibold">
                  Station {c.stationNumber}:
                </span>{" "}
                <span className="font-medium">{c.title}</span>
              </p>
              <p className="flex items-center gap-2 text-sm leading-[150%] text-black-others">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: SPECIALTY_DOT[c.specialty] ?? "#6F6F6F",
                  }}
                />
                {c.specialty}
              </p>
            </div>

            <button
              type="button"
              aria-label="Edit case"
              className="shrink-0 p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <EditIcon />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
