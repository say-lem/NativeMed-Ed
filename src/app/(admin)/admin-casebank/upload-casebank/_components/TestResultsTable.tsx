"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Label } from "./fields";
import type { CaseFormValues } from "@/lib/schemas/case";

const cellInput =
  "px-3 sm:px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none w-full bg-transparent";
const placeholders = ["e.g., TSH", "e.g., 4.9 mU/L", "e.g., 0.4 – 4.0"];

export default function TestResultsTable() {
  const { register, control } = useFormContext<CaseFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bloodTests",
  });

  return (
    <div className="space-y-3">
      <Label text="Test Results" />
      <div className="rounded-lg border border-[#EDEDED] overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] bg-[#F7F7F8] border-b border-[#EDEDED]">
          {["Test", "Result", "Reference Range"].map((h) => (
            <span
              key={h}
              className="px-3 sm:px-4 py-3 text-sm font-medium text-black-others"
            >
              {h}
            </span>
          ))}
          <span className="px-3 py-3 text-sm font-medium text-black-others">
            Abn.
          </span>
        </div>
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-[#EDEDED] last:border-b-0 divide-x divide-[#EDEDED] items-center"
          >
            <input
              placeholder={placeholders[0]}
              className={cellInput}
              {...register(`bloodTests.${i}.test`)}
            />
            <input
              placeholder={placeholders[1]}
              className={cellInput}
              {...register(`bloodTests.${i}.result`)}
            />
            <input
              placeholder={placeholders[2]}
              className={cellInput}
              {...register(`bloodTests.${i}.referenceRange`)}
            />
            <div className="flex items-center gap-2 px-3">
              <input
                type="checkbox"
                aria-label="Abnormal"
                className="size-4 accent-primary-100 cursor-pointer"
                {...register(`bloodTests.${i}.isAbnormal`)}
              />
              <button
                type="button"
                aria-label="Remove row"
                onClick={() => remove(i)}
                className="text-[#B7B7B9] hover:text-[#E5102E] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          append({ test: "", result: "", referenceRange: "", isAbnormal: false })
        }
        className="block ml-auto text-sm font-medium text-primary-100 cursor-pointer"
      >
        + Add Test Result
      </button>
    </div>
  );
}
