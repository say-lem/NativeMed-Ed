import { z } from "zod";

export const SPECIALTIES = [
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

export const GENDERS = ["male", "female", "other"];

export const caseSchema = z.object({
  // Doctor step
  title: z.string().trim().min(1, "Title is required"),
  specialty: z.string().min(1, "Category is required"),
  stationNumber: z
    .string()
    .trim()
    .min(1, "Station number is required")
    .regex(/^\d+$/, "Enter a whole number")
    .refine((v) => Number(v) >= 1, "Must be at least 1"),
  patientName: z.string().trim().min(1, "Patient name is required"),
  gender: z
    .string()
    .refine((v) => GENDERS.includes(v), "Select a gender"),
  age: z
    .string()
    .trim()
    .min(1, "Age is required")
    .regex(/^\d+$/, "Enter a whole number")
    .refine((v) => Number(v) >= 0 && Number(v) <= 130, "Enter a valid age (0–130)"),
  pastMedicalHistory: z.string(),
  drugHistory: z.string(),
  seenBy: z.string(),
  recentNotes: z.string(),
  bloodTests: z.array(
    z.object({
      test: z.string(),
      result: z.string(),
      referenceRange: z.string(),
      isAbnormal: z.boolean(),
    }),
  ),
  // Patient step (composed into patientStory)
  patientStory: z.string().trim().min(1, "Patient story is required"),
  socialHistory: z.string(),
  ifAsked: z.string(),
  idea: z.string(),
  concern: z.string(),
  expectation: z.string(),
  importantNote: z.string(),
  questionsForDoctor: z.string(),
  // Examiner step
  dataGathering: z.string().trim().min(1, "At least one marking point is required"),
  expectedDiagnosis: z.string(),
  exampleExplanation: z.string().trim().min(1, "Explanation is required"),
  management: z
    .array(z.object({ value: z.string() }))
    .refine((arr) => arr.some((m) => m.value.trim()), "Add at least one management step"),
  learningPoints: z.string().trim().min(1, "Learning points are required"),
  // Resources step
  resources: z.array(z.object({ title: z.string(), url: z.string() })),
});

export type CaseFormValues = z.infer<typeof caseSchema>;

export const emptyCaseValues: CaseFormValues = {
  title: "",
  specialty: "",
  stationNumber: "",
  patientName: "",
  gender: "",
  age: "",
  pastMedicalHistory: "",
  drugHistory: "",
  seenBy: "",
  recentNotes: "",
  bloodTests: [
    { test: "", result: "", referenceRange: "", isAbnormal: false },
    { test: "", result: "", referenceRange: "", isAbnormal: false },
  ],
  patientStory: "",
  socialHistory: "",
  ifAsked: "",
  idea: "",
  concern: "",
  expectation: "",
  importantNote: "",
  questionsForDoctor: "",
  dataGathering: "",
  expectedDiagnosis: "",
  exampleExplanation: "",
  management: [{ value: "" }, { value: "" }],
  learningPoints: "",
  resources: [
    { title: "", url: "" },
    { title: "", url: "" },
    { title: "", url: "" },
  ],
};
