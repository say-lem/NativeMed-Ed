"use client";
import { useState } from "react";
import { FormCard, SectionHeading, TextField } from "./fields";

export default function ResourcesStep() {
  const [count, setCount] = useState(3);

  return (
    <div className="space-y-4">
      <SectionHeading text="Resources" />
      <FormCard>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#EDEDED] last:border-b-0 pb-6 last:pb-0"
          >
            <TextField
              label="Resource Name"
              name={`resourceName-${i}`}
              placeholder="Enter title of resource"
            />
            <TextField
              label="Resource URL"
              name={`resourceUrl-${i}`}
              placeholder="Add link"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="self-end rounded-full border border-primary-100 text-primary-100 text-sm font-medium px-4 py-1.5 cursor-pointer"
        >
          + Add Resource
        </button>
      </FormCard>
    </div>
  );
}
