import type { CaseDetail } from "@/types/api";
import type { TypeMockCasesPresentation } from "@/types/MockCasesPresentationInterface";

const PLACEHOLDER = "—";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface ParsedStory {
  socialHistory: string;
  ice: { tag: string; desc: string }[];
  questionsForDoctor: string[];
  importantNote: string;
}

const LABEL_PATTERNS: Array<{
  key: "socialHistory" | "idea" | "concern" | "expectation" | "questions";
  regex: RegExp;
}> = [
  { key: "socialHistory", regex: /^Social\s+history\s*:\s*([\s\S]*)/i },
  { key: "idea", regex: /^Ideas?\s*:\s*([\s\S]*)/i },
  { key: "concern", regex: /^Concerns?\s*:\s*([\s\S]*)/i },
  { key: "expectation", regex: /^Expectations?\s*:\s*([\s\S]*)/i },
  {
    key: "questions",
    regex: /^Questions?\s+for\s+the\s+[Dd]octor\s*[?:]?\s*([\s\S]*)/i,
  },
];

const IMPORTANT_NOTE_REGEX = /^Say\s+NO\s+to\s+any\s+other[\s\S]*/i;

export function parsePatientStory(story: string): ParsedStory {
  const result: ParsedStory = {
    socialHistory: "",
    ice: [],
    questionsForDoctor: [],
    importantNote: "",
  };

  const paragraphs = story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  let lastLabel: "questions" | null = null;

  for (const para of paragraphs) {
    if (IMPORTANT_NOTE_REGEX.test(para)) {
      result.importantNote = para;
      lastLabel = null;
      continue;
    }

    let matched = false;
    for (const { key, regex } of LABEL_PATTERNS) {
      const m = para.match(regex);
      if (!m) continue;
      const content = (m[1] ?? "").trim();
      switch (key) {
        case "socialHistory":
          result.socialHistory = content;
          break;
        case "idea":
          result.ice.push({ tag: "idea", desc: content });
          break;
        case "concern":
          result.ice.push({ tag: "concern", desc: content });
          break;
        case "expectation":
          result.ice.push({ tag: "expectation", desc: content });
          break;
        case "questions":
          if (content) result.questionsForDoctor.push(content);
          lastLabel = "questions";
          matched = true;
          break;
      }
      if (key !== "questions") lastLabel = null;
      matched = true;
      break;
    }

    if (!matched && lastLabel === "questions") {
      result.questionsForDoctor.push(para);
    } else if (!matched) {
      lastLabel = null;
    }
  }

  return result;
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
  const safetyNet = match ? item.slice(match.index! + match[0].length).trim() : item;
  const remaining = management.filter((_, i) => i !== idx);
  return { safetyNet, remaining };
}

export function adaptCase(detail: CaseDetail): TypeMockCasesPresentation {
  const patient = detail.patientData;
  const consultation = patient.recentConsultation;
  const blood = patient.bloodTestResults;

  const parsed = parsePatientStory(detail.patientStory ?? "");
  const { safetyNet, remaining: managementRemaining } = extractSafetyNet(
    detail.management ?? [],
  );

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
    safetyNet: safetyNet || PLACEHOLDER,

    patientBrief: detail.patientStory || PLACEHOLDER,

    // Parsed from patientStory; fall back to em-dash / [] when absent
    socialHistory: parsed.socialHistory || PLACEHOLDER,
    importantNote: parsed.importantNote || PLACEHOLDER,
    questionsForDoctor: parsed.questionsForDoctor,
    patientsIdeaConcernExpectation: parsed.ice,
  };
}
