"use client";
import { useFormContext } from "react-hook-form";
import {
  FormCard,
  MarkdownField,
  NumberField,
  SectionHeading,
  SelectField,
  TextArea,
  TextField,
} from "./fields";
import TestResultsTable from "./TestResultsTable";
import {
  CONSULTATION_TYPES,
  DIFFICULTIES,
  GENDERS,
  SPECIALTIES,
  type CaseFormValues,
} from "@/lib/schemas/case";

export default function DoctorStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <div className="space-y-4">
      <SectionHeading text="Patient Data" />
      <FormCard>
        <TextField
          label="Case Title"
          required
          placeholder="e.g., Chest Pain in 57-year-old"
          registration={register("title")}
          error={errors.title?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Category"
            required
            placeholder="Select Category"
            options={SPECIALTIES}
            registration={register("specialty")}
            error={errors.specialty?.message}
          />
          <NumberField
            label="Station Number"
            required
            registration={register("stationNumber")}
            error={errors.stationNumber?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Consultation Type"
            placeholder="Select Consultation Type"
            options={CONSULTATION_TYPES}
            registration={register("consultationType")}
            error={errors.consultationType?.message}
          />
          <SelectField
            label="Difficulty"
            placeholder="Select Difficulty"
            options={DIFFICULTIES}
            registration={register("difficulty")}
            error={errors.difficulty?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField
            label="Patient Name"
            required
            placeholder="e.g., Lizzy Smith"
            registration={register("patientName")}
            error={errors.patientName?.message}
          />
          <SelectField
            label="Patient Gender"
            required
            placeholder="Select Gender"
            options={GENDERS}
            registration={register("gender")}
            error={errors.gender?.message}
          />
          <NumberField
            label="Patient Age"
            required
            registration={register("age")}
            error={errors.age?.message}
          />
        </div>

        <TextArea
          label="Past Medical History"
          rows={3}
          placeholder="One per line, e.g.&#10;Hypertension&#10;Type 2 Diabetes"
          registration={register("pastMedicalHistory")}
          error={errors.pastMedicalHistory?.message}
        />
        <TextArea
          label="Drug and Allergy History"
          rows={3}
          placeholder="One per line, e.g.&#10;Amlodipine 10mg once daily&#10;No Known Drug Allergy"
          registration={register("drugHistory")}
          error={errors.drugHistory?.message}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField
            label="Seen By"
            required
            placeholder="e.g., GP Surgery / Practice Nurse"
            registration={register("seenBy")}
            error={errors.seenBy?.message}
          />
          <TextField
            label="Role"
            placeholder="e.g., Doctor, Nurse, GP"
            registration={register("recentRole")}
            error={errors.recentRole?.message}
          />
          <TextField
            label="Consultation Date"
            type="date"
            registration={register("recentDate")}
            error={errors.recentDate?.message}
          />
        </div>
        <MarkdownField
          name="recentNotes"
          label="Recent Notes/Consultation"
          required
          placeholder="Enter consultation notes, examination findings, plans, etc..."
          error={errors.recentNotes?.message}
        />

        <TextArea
          label="Blood Test Summary"
          required
          rows={2}
          placeholder="Short summary shown above the blood-test table"
          registration={register("bloodTestSummary")}
          error={errors.bloodTestSummary?.message}
        />
        <TestResultsTable />
      </FormCard>
    </div>
  );
}
