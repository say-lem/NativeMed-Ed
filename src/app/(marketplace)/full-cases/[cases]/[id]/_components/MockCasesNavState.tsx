"use client";
import { useState } from "react";
import FullCase from "./FullCase";
import Patient from "./Patient";
import Doctor from "./Doctor";
import Examiner from "./Examiner";
import Resources from "./Resources";
import type { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";

export default function MocKCasesNavState({
  color,
  mockData,
}: {
  color: string;
  mockData: TypeMockCasesPresentation;
}) {
  const [activeBtn, setActiveBtn] = useState("Full Case");

  const tabs = ["Full Case", "Patient", "Doctor", "Examiner", "Resources"];

  return (
    <>
      <div
        className="flex gap-1 sm:gap-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((item) => (
          <button
            key={item}
            style={{
              color: activeBtn === item ? color : "",
              borderBottomColor: activeBtn === item ? color : "",
            }}
            className={`text-subtle-text font-semibold cursor-pointer leading-[120%] tracking-[-1%] px-2 sm:px-4 pb-2.5 text-xs sm:text-sm whitespace-nowrap ${
              activeBtn === item ? "border-b-2 font-black" : ""
            }`}
            onClick={() => setActiveBtn(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="py-4 sm:py-6 lg:py-8">
        {activeBtn === "Full Case" ? (
          <FullCase mockData={mockData} />
        ) : activeBtn === "Patient" ? (
          <Patient mockData={mockData} />
        ) : activeBtn === "Doctor" ? (
          <Doctor mockData={mockData} />
        ) : activeBtn === "Examiner" ? (
          <Examiner mockData={mockData} />
        ) : (
          <Resources mockData={mockData} />
        )}
      </div>
    </>
  );
}
