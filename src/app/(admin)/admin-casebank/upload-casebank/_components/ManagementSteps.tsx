"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { fieldClass, FieldError, Label } from "./fields";
import type { CaseFormValues } from "@/lib/schemas/case";

export default function ManagementSteps() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CaseFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "management",
  });

  const rootError = errors.management?.root?.message ?? errors.management?.message;

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f, i) => (
        <div key={f.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label text={`Step ${i + 1}`} />
            {fields.length > 1 && (
              <button
                type="button"
                aria-label={`Remove step ${i + 1}`}
                onClick={() => remove(i)}
                className="text-[#B7B7B9] hover:text-[#E5102E] cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <input
            placeholder="Enter step"
            className={fieldClass}
            {...register(`management.${i}.value`)}
          />
        </div>
      ))}
      <FieldError message={rootError} />
      <button
        type="button"
        onClick={() => append({ value: "" })}
        className="self-end rounded-full border border-primary-100 text-primary-100 text-sm font-medium px-4 py-1.5 cursor-pointer"
      >
        + Add Step
      </button>
    </div>
  );
}
