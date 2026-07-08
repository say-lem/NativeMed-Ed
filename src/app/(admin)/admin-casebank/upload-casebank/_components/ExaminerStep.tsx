"use client";
import { useFormContext } from "react-hook-form";
import { FormCard, MarkdownField, SectionHeading, TextArea } from "./fields";
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
        <MarkdownField
          name="exampleExplanation"
          label="Explanation to Patient"
          required
          placeholder="Explanation to Patient"
          error={errors.exampleExplanation?.message}
        />
      </FormCard>

      <SectionHeading text="Management" />
      <FormCard>
        <ManagementSteps />
      </FormCard>

      <FormCard>
        <MarkdownField
          name="learningPoints"
          label="Learning Points from this Station"
          required
          placeholder="Learning Points"
          error={errors.learningPoints?.message}
        />
      </FormCard>
    </div>
  );
}
