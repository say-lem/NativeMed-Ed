import type { CaseDetail } from "@/types/api";
import type { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";

const PLACEHOLDER = "—";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatConsultationDate(date?: string): string {
  if (!date) return "Recent";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recent";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const SAFETY_NET_REGEX = /safety[-\s]?net(?:ting)?(?:\s+advice)?\s*:\s*/i;

export function extractSafetyNet(management: string[]): {
  safetyNet: string;
  remaining: string[];
} {
  const idx = management.findIndex((item) => /safety[-\s]?net/i.test(item));
  if (idx === -1) return { safetyNet: "", remaining: management };

  const item = management[idx];
  const match = item.match(SAFETY_NET_REGEX);
  const safetyNet = match
    ? item.slice(match.index! + match[0].length).trim()
    : item;
  const remaining = management.filter((_, i) => i !== idx);
  return { safetyNet, remaining };
}

export function adaptCase(detail: CaseDetail): TypeMockCasesPresentation {
  const patient = detail.patientData;
  const consultation = patient.recentConsultation;
  const blood = patient.bloodTestResults;

  const { safetyNet, remaining: managementRemaining } = extractSafetyNet(
    detail.management ?? [],
  );

  return {
    name: patient.name,
    gender: capitalize(patient.gender),
    age: patient.age,

    imageUrl: detail.imageUrl,
    stationImageUrl: detail.stationImageUrl,

    medicalHistory: patient.pastMedicalHistory ?? [],
    drugAndAllergyHistory: patient.drugHistory ?? [],

    recentNotes: consultation
      ? [
          {
            time: formatConsultationDate(consultation.date),
            doctor: consultation.role
              ? `${consultation.seenBy || PLACEHOLDER} (${consultation.role})`
              : consultation.seenBy || PLACEHOLDER,
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
        isAbnormal: row.isAbnormal,
      })),
      normalResults: blood?.summary ?? PLACEHOLDER,
    },

    dataGatheringAndDiagnosis: (detail.markingScheme ?? []).map((section) => ({
      title: section.heading,
      otherThings: section.points,
    })),

    furtherReading: detail.furtherResources ?? [],

    patientExplanation: detail.exampleExplanation || PLACEHOLDER,
    learningPoints: detail.learningPoints || PLACEHOLDER,
    management: managementRemaining,
    safetyNet: safetyNet || "",

    patientBrief: detail.patientStory || PLACEHOLDER,
  };
}
