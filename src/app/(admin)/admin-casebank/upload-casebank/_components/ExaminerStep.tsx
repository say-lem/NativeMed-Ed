"use client";
import { useFormContext } from "react-hook-form";
import { FormCard, SectionHeading, TextArea } from "./fields";
import ManagementSteps from "./ManagementSteps";
import type { CaseFormValues } from "@/lib/schemas/case";

export default function ExaminerStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <div className="space-y-4">
      <SectionHeading text="Marking Scheme" />
      <FormCard>
        <TextArea
          label="Data Gathering and Diagnosis"
          required
          rows={6}
          placeholder="One marking point per line"
          registration={register("dataGathering")}
          error={errors.dataGathering?.message}
        />
        <TextArea
          label="Expected Diagnosis"
          placeholder="One point per line (optional)"
          registration={register("expectedDiagnosis")}
          error={errors.expectedDiagnosis?.message}
        />
      </FormCard>

      <FormCard>
        <TextArea
          label="Explanation to Patient"
          required
          placeholder="Explanation to Patient"
          registration={register("exampleExplanation")}
          error={errors.exampleExplanation?.message}
        />
      </FormCard>

      <SectionHeading text="Management" />
      <FormCard>
        <ManagementSteps />
      </FormCard>

      <FormCard>
        <TextArea
          label="Learning Points from this Station"
          required
          placeholder="Learning Points"
          registration={register("learningPoints")}
          error={errors.learningPoints?.message}
        />
      </FormCard>
    </div>
  );
}
