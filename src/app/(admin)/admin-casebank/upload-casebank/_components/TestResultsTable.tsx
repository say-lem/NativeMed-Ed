"use client";
import { useState } from "react";
import { Label } from "./fields";

const cellInput =
  "px-3 sm:px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none w-full bg-transparent";

const placeholders = ["e.g., TSH", "e.g., 4.9 mU/L", "e.g., 0.4 – 4.0"];

export default function TestResultsTable() {
  const [rows, setRows] = useState(2);

  return (
    <div className="space-y-3">
      <Label text="Test Results" />
      <div className="rounded-lg border border-[#EDEDED] overflow-hidden">
        <div className="grid grid-cols-3 bg-[#F7F7F8] border-b border-[#EDEDED]">
          {["Test", "Result", "Reference Range"].map((h) => (
            <span
              key={h}
              className="px-3 sm:px-4 py-3 text-sm font-medium text-black-others"
            >
              {h}
            </span>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 border-b border-[#EDEDED] last:border-b-0 divide-x divide-[#EDEDED]"
          >
            {placeholders.map((p, j) => (
              <input key={j} placeholder={p} className={cellInput} />
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows((r) => r + 1)}
        className="block ml-auto text-sm font-medium text-primary-100 cursor-pointer"
      >
        + Add Test Result
      </button>
    </div>
  );
}
