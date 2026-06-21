"use client";
import {
  FormCard,
  NumberField,
  SectionHeading,
  SelectField,
  TextArea,
  TextField,
} from "./fields";
import TestResultsTable from "./TestResultsTable";

const SPECIALTIES = [
  "Cardiology",
  "Dermatology/Allergy/Immunology",
  "Elderly Medicine/ Palliative",
  "Endocrine and Nephrology",
  "ENT & Eye",
  "Ethics",
  "Gastroenterology/ Haematology",
  "Genetics",
  "Gynaecology/ Women's Health",
  "Men's Health",
  "Mental Health",
  "Neurology",
  "Paediatrics",
  "Respiratory",
  "Rheumatology/ Musculoskeletal",
  "Travel Health/ Infectious Disease",
];

const GENDERS = ["male", "female", "other"];

export default function DoctorStep() {
  return (
    <div className="space-y-4">
      <SectionHeading text="Patient Data" />
      <FormCard>
        <TextField
          label="Question Title"
          name="title"
          required
          placeholder="e.g., Chest Pain in 57-year-old"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Category"
            name="specialty"
            required
            placeholder="Select Category"
            options={SPECIALTIES}
          />
          <NumberField label="Station Number" name="stationNumber" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField
            label="Patient Name"
            name="patientName"
            required
            placeholder="e.g., Lizzy Smith"
          />
          <SelectField
            label="Patient Gender"
            name="gender"
            required
            placeholder="Select Gender"
            options={GENDERS}
          />
          <NumberField label="Patient Age" name="age" required />
        </div>

        <TextField
          label="Past Medical History"
          name="pastMedicalHistory"
          placeholder="e.g., Hypertension"
        />
        <TextField
          label="Drug and Allergy History"
          name="drugHistory"
          placeholder="e.g., Amlodipine 10mg once daily"
        />
        <TextArea
          label="Recent Notes/Consultation"
          name="recentNotes"
          placeholder="Enter consultation notes, examination findings, plans, etc..."
        />

        <TestResultsTable />
      </FormCard>
    </div>
  );
}
