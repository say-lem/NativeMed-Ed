"use client";
import { useFormContext } from "react-hook-form";
import {
  FormCard,
  NumberField,
  SectionHeading,
  SelectField,
  TextArea,
  TextField,
} from "./fields";
import TestResultsTable from "./TestResultsTable";
import { GENDERS, SPECIALTIES, type CaseFormValues } from "@/lib/schemas/case";

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
          label="Question Title"
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
        <TextField
          label="Seen By"
          placeholder="e.g., GP Surgery / Practice Nurse"
          registration={register("seenBy")}
          error={errors.seenBy?.message}
        />
        <TextArea
          label="Recent Notes/Consultation"
          placeholder="Enter consultation notes, examination findings, plans, etc..."
          registration={register("recentNotes")}
          error={errors.recentNotes?.message}
        />

        <TestResultsTable />
      </FormCard>
    </div>
  );
}
