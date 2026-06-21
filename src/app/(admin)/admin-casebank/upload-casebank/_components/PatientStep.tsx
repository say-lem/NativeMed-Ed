"use client";
import { FormCard, SectionHeading, TextArea, TextField } from "./fields";

export default function PatientStep() {
  return (
    <div className="space-y-4">
      <SectionHeading text="Patient Story (Role Player's Brief)" />
      <FormCard>
        <TextArea
          label="Background Story"
          name="patientStory"
          placeholder="Patient story"
        />
        <TextArea
          label="Social History"
          name="socialHistory"
          placeholder="Patient social history"
        />
        <TextArea
          label="If Asked Scenarios"
          name="ifAsked"
          placeholder="Enter conditional information"
        />
        <TextField
          label="Idea"
          name="idea"
          placeholder="What the patient thinks is causing their symptoms"
        />
        <TextField
          label="Concern"
          name="concern"
          placeholder="What the patient is worried about"
        />
        <TextField
          label="Expectation"
          name="expectation"
          placeholder="What the patient hopes will happen"
        />
        <TextArea
          label="Important Note"
          name="importantNote"
          placeholder="What to say no to"
        />
        <TextArea
          label="Questions for the Doctor"
          name="questionsForDoctor"
          placeholder="Questions for the Doctor"
        />
      </FormCard>
    </div>
  );
}
