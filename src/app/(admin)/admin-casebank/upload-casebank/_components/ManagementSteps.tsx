"use client";
import { useState } from "react";
import { fieldClass, Label } from "./fields";

export default function ManagementSteps() {
  const [count, setCount] = useState(2);

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Label text={`Step ${i + 1}`} />
          <input
            name={`management-${i}`}
            placeholder="Enter step"
            className={fieldClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="self-end rounded-full border border-primary-100 text-primary-100 text-sm font-medium px-4 py-1.5 cursor-pointer"
      >
        + Add Step
      </button>
    </div>
  );
}
