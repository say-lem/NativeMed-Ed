"use client";
import { useFormContext } from "react-hook-form";
import { FormCard, SectionHeading, TextArea, TextField } from "./fields";
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
        <TextArea
          label="Background Story"
          required
          placeholder="Patient story"
          registration={register("patientStory")}
          error={errors.patientStory?.message}
        />
        <TextArea
          label="Social History"
          placeholder="Patient social history"
          registration={register("socialHistory")}
          error={errors.socialHistory?.message}
        />
        <TextArea
          label="If Asked Scenarios"
          placeholder="Enter conditional information"
          registration={register("ifAsked")}
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
        <TextArea
          label="Important Note"
          placeholder="What to say no to"
          registration={register("importantNote")}
          error={errors.importantNote?.message}
        />
        <TextArea
          label="Questions for the Doctor"
          placeholder="Questions for the Doctor"
          registration={register("questionsForDoctor")}
          error={errors.questionsForDoctor?.message}
        />
      </FormCard>
    </div>
  );
}
