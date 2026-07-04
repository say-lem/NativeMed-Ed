"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { FormCard, SectionHeading, TextField } from "./fields";
import type { CaseFormValues } from "@/lib/schemas/case";

export default function ResourcesStep() {
  const { register, control } = useFormContext<CaseFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "resources",
  });

  return (
    <div className="space-y-4">
      <SectionHeading text="Resources" />
      <FormCard>
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#EDEDED] last:border-b-0 pb-6 last:pb-0"
          >
            <TextField
              label="Resource Name"
              placeholder="Enter title of resource"
              registration={register(`resources.${i}.title`)}
            />
            <TextField
              label="Resource URL"
              placeholder="Add link"
              registration={register(`resources.${i}.url`)}
            />
            {fields.length > 1 && (
              <button
                type="button"
                aria-label={`Remove resource ${i + 1}`}
                onClick={() => remove(i)}
                className="absolute right-0 top-0 text-[#B7B7B9] hover:text-[#E5102E] cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ title: "", url: "" })}
          className="self-end rounded-full border border-primary-100 text-primary-100 text-sm font-medium px-4 py-1.5 cursor-pointer"
        >
          + Add Resource
        </button>
      </FormCard>
    </div>
  );
}
