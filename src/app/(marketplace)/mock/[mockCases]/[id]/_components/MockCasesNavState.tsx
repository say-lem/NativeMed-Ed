"use client";
import { useState } from "react";
import FullCase from "./FullCase";
import Patient from "./Patient";
import Doctor from "./Doctor";
import Examiner from "./Examiner";
import Resources from "./Resources";

interface Prop {
  color: string;
}

// Mock data
const mockData = {
  name: "Adetokunbo Ademola",
  gender: "Male",
  age: 56,
  medicalHistory: [
    "Hypertension",
    "Hypercholesterolaemia",
    "Benign prostatic hyperplasia",
  ],
  drugAndAllergyHistory: [
    "Amlodipine 10 mg once daily",
    "Atorvastatin 20 mg at night",
    "Tamsulosin 400 mcg once daily",
  ],
  furtherReading: [
    "NICE CKS: Hypothyroidism - Subclinical hypothyroidism (non-pregnant)",
    "NICE CKS: Hypothyroidism - Subclinical hypothyroidism (non-ggg)",
  ],
};

export default function MocKCasesNavState({ color }: Prop) {
  const [activeBtn, setActiveBtn] = useState("Full Case");
  const toggleActiveBtn = (value: string) => {
    setActiveBtn(value);
  };

  return (
    <>
      <div className="flex gap-2">
        {["Full Case", "Patient", "Doctor", "Examiner", "Resources"].map(
          (item) => (
            <button
              style={{
                color: activeBtn === item ? color : "",
                borderBottomColor: activeBtn === item ? color : "",
              }}
              key={item}
              className={`text-subtle-text font-semibold cursor-pointer leading-[120%] tracking-[-1%] px-4 pb-2.5 ${
                activeBtn === item ? "border-b-2 font-black" : ""
              }`}
              onClick={() => toggleActiveBtn(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="py-8">
        {activeBtn === "Full Case" ? (
          <FullCase mockData={mockData} />
        ) : activeBtn === "Patient" ? (
          <Patient />
        ) : activeBtn === "Doctor" ? (
          <Doctor />
        ) : activeBtn === "Examiner" ? (
          <Examiner />
        ) : (
          <Resources mockData={mockData} />
        )}{" "}
      </div>
    </>
  );
}
