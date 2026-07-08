"use client";
import { useFormContext } from "react-hook-form";
import {
  FormCard,
  MarkdownField,
  SectionHeading,
  TextField,
} from "./fields";
import type { CaseFormValues } from "@/lib/schemas/case";

export default function PatientStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <div className="space-y-4">
      <SectionHeading text="Patient Story (Role Player's Brief)" />
      <FormCard>
        <MarkdownField
          name="patientStory"
          label="Background Story"
          required
          placeholder="Patient story"
          error={errors.patientStory?.message}
        />
        <MarkdownField
          name="socialHistory"
          label="Social History"
          placeholder="Patient social history"
          error={errors.socialHistory?.message}
        />
        <MarkdownField
          name="ifAsked"
          label="If Asked Scenarios"
          placeholder="Enter conditional information"
          error={errors.ifAsked?.message}
        />
        <TextField
          label="Idea"
          placeholder="What the patient thinks is causing their symptoms"
          registration={register("idea")}
          error={errors.idea?.message}
        />
        <TextField
          label="Concern"
          placeholder="What the patient is worried about"
          registration={register("concern")}
          error={errors.concern?.message}
        />
        <TextField
          label="Expectation"
          placeholder="What the patient hopes will happen"
          registration={register("expectation")}
          error={errors.expectation?.message}
        />
        <MarkdownField
          name="importantNote"
          label="Important Note"
          placeholder="What to say no to"
          error={errors.importantNote?.message}
        />
        <MarkdownField
          name="questionsForDoctor"
          label="Questions for the Doctor"
          placeholder="Questions for the Doctor"
          error={errors.questionsForDoctor?.message}
        />
      </FormCard>
    </div>
  );
}
