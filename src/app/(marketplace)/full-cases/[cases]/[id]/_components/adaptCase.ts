import type { CaseDetail } from "@/types/api";
import type { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";

const PLACEHOLDER = "—";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function adaptCase(detail: CaseDetail): TypeMockCasesPresentation {
  const patient = detail.patientData;
  const consultation = patient.recentConsultation;
  const blood = patient.bloodTestResults;

  return {
    name: patient.name,
    gender: capitalize(patient.gender),
    age: patient.age,

    medicalHistory: patient.pastMedicalHistory ?? [],
    drugAndAllergyHistory: patient.drugHistory ?? [],

    recentNotes: consultation
      ? [
          {
            time: "Recent",
            doctor: consultation.seenBy || PLACEHOLDER,
            complaint: consultation.notes || PLACEHOLDER,
            examination: PLACEHOLDER,
            Plan: PLACEHOLDER,
          },
        ]
      : [],

    investigationResults: {
      tableData: (blood?.rows ?? []).map((row) => ({
        test: row.test ?? PLACEHOLDER,
        result: row.result ?? PLACEHOLDER,
        referenceRange: row.referenceRange ?? PLACEHOLDER,
      })),
      normalResults: blood?.summary ?? PLACEHOLDER,
    },

    dataGatheringAndDiagnosis: (detail.markingScheme ?? []).map((section) => ({
      title: section.heading,
      otherThings: section.points,
    })),

    // TODO: backend provides `furtherResources` as `{title, url}[]`. Existing
    // Resources.tsx expects `string[]` and uses `href="#"`. We currently keep
    // only the title to avoid touching the component. When we refactor
    // Resources.tsx to take `{title, url}[]` directly, surface the URLs.
    furtherReading: (detail.furtherResources ?? []).map((r) => r.title),

    patientExplanation: detail.exampleExplanation || PLACEHOLDER,
    learningPoints: detail.learningPoints || PLACEHOLDER,
    management: detail.management ?? [],

    patientBrief: detail.patientStory || PLACEHOLDER,

    // Fields the API does NOT yet provide — placeholders keep UI structure
    // intact so adding them later is a one-line change in this adapter.
    safetyNet: PLACEHOLDER,
    socialHistory: PLACEHOLDER,
    importantNote: PLACEHOLDER,
    questionsForDoctor: [],
    patientsIdeaConcernExpectation: [],
  };
}
