import type { CaseDetail, CaseInput } from "@/types/api";
import type { CaseFormValues } from "@/lib/schemas/case";

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
}

function arrayToLines(arr?: string[]): string {
  return (arr ?? []).join("\n");
}

/* ------------------------------------------------------------------ *
 * patientStory  <->  separate authoring fields
 *
 * The backend stores the whole patient narrative in ONE markdown field,
 * with bold section headings. We compose those headings on save and parse
 * them back on load. Parsing is LOSSLESS: anything not under a known
 * heading falls back into the main "Background Story" field.
 * ------------------------------------------------------------------ */

const STORY_SECTIONS: { field: keyof StoryFields; label: string; test: RegExp }[] = [
  { field: "socialHistory", label: "Social History", test: /^social history$/i },
  { field: "ifAsked", label: "If Asked", test: /^if asked.*$/i },
  { field: "idea", label: "Ideas", test: /^ideas?$/i },
  { field: "concern", label: "Concerns", test: /^concerns?$/i },
  { field: "expectation", label: "Expectations", test: /^expectations?$/i },
  { field: "importantNote", label: "Important Note", test: /^important note$/i },
  {
    field: "questionsForDoctor",
    label: "Questions for the Doctor",
    test: /^questions? for the doctor$/i,
  },
];

type StoryFields = {
  patientStory: string;
  socialHistory: string;
  ifAsked: string;
  idea: string;
  concern: string;
  expectation: string;
  importantNote: string;
  questionsForDoctor: string;
};

export function composePatientStory(v: StoryFields): string {
  const parts: string[] = [];
  if (v.patientStory.trim()) parts.push(v.patientStory.trim());
  for (const s of STORY_SECTIONS) {
    const val = v[s.field].trim();
    if (val) parts.push(`**${s.label}**\n${val}`);
  }
  return parts.join("\n\n");
}

export function parsePatientStory(md: string): StoryFields {
  const out: StoryFields = {
    patientStory: "",
    socialHistory: "",
    ifAsked: "",
    idea: "",
    concern: "",
    expectation: "",
    importantNote: "",
    questionsForDoctor: "",
  };
  const text = md ?? "";
  const headingRe = /\*\*\s*([^*]+?)\s*\*\*:?/g;
  const boundaries: { field: keyof StoryFields; start: number; contentStart: number }[] = [];

  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(text))) {
    const inner = m[1].trim().replace(/:$/, "");
    const def = STORY_SECTIONS.find((s) => s.test.test(inner));
    if (def) {
      boundaries.push({
        field: def.field,
        start: m.index,
        contentStart: m.index + m[0].length,
      });
    }
  }

  if (boundaries.length === 0) {
    out.patientStory = text.trim();
    return out;
  }

  out.patientStory = text.slice(0, boundaries[0].start).trim();
  for (let i = 0; i < boundaries.length; i++) {
    const end = i + 1 < boundaries.length ? boundaries[i + 1].start : text.length;
    out[boundaries[i].field] = text.slice(boundaries[i].contentStart, end).trim();
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Case detail  ->  form values (prefill)
 * ------------------------------------------------------------------ */

export function caseToFormValues(c: CaseDetail): CaseFormValues {
  const story = parsePatientStory(c.patientStory ?? "");

  const dg = c.markingScheme?.find((s) => /data gathering/i.test(s.heading));
  const ed = c.markingScheme?.find((s) => /expected diagnosis/i.test(s.heading));
  const others = (c.markingScheme ?? []).filter((s) => s !== dg && s !== ed);
  let dataGathering = dg ? dg.points.join("\n") : "";
  // Lossless: any extra marking sections reflow into the main textarea.
  for (const s of others) {
    dataGathering += (dataGathering ? "\n" : "") + s.points.join("\n");
  }

  const management = (c.management ?? []).map((value) => ({ value }));
  const resources = (c.furtherResources ?? []).map((r) => ({
    title: r.title ?? "",
    url: r.url ?? "",
  }));

  return {
    title: c.title ?? "",
    specialty: c.specialty ?? "",
    consultationType: c.consultationType ?? "",
    difficulty: c.difficulty ?? "",
    stationNumber: c.stationNumber != null ? String(c.stationNumber) : "",
    patientName: c.patientData?.name ?? "",
    gender: c.patientData?.gender ?? "",
    age: c.patientData?.age != null ? String(c.patientData.age) : "",
    pastMedicalHistory: arrayToLines(c.patientData?.pastMedicalHistory),
    drugHistory: arrayToLines(c.patientData?.drugHistory),
    seenBy: c.patientData?.recentConsultation?.seenBy ?? "",
    recentRole: c.patientData?.recentConsultation?.role ?? "",
    // Stored value may be a full ISO datetime; <input type="date"> needs YYYY-MM-DD.
    recentDate: (c.patientData?.recentConsultation?.date ?? "").slice(0, 10),
    recentNotes: c.patientData?.recentConsultation?.notes ?? "",
    bloodTestSummary: c.patientData?.bloodTestResults?.summary ?? "",
    bloodTests: (c.patientData?.bloodTestResults?.rows ?? []).map((r) => ({
      test: r.test ?? "",
      result: r.result ?? "",
      referenceRange: r.referenceRange ?? "",
      isAbnormal: !!r.isAbnormal,
    })),
    patientStory: story.patientStory,
    socialHistory: story.socialHistory,
    ifAsked: story.ifAsked,
    idea: story.idea,
    concern: story.concern,
    expectation: story.expectation,
    importantNote: story.importantNote,
    questionsForDoctor: story.questionsForDoctor,
    dataGathering,
    expectedDiagnosis: ed ? ed.points.join("\n") : "",
    exampleExplanation: c.exampleExplanation ?? "",
    management: management.length ? management : [{ value: "" }],
    learningPoints: c.learningPoints ?? "",
    resources: resources.length ? resources : [{ title: "", url: "" }],
  };
}

/* ------------------------------------------------------------------ *
 * Form values  ->  API payload (POST / PATCH)
 * ------------------------------------------------------------------ */

export function buildCasePayload(
  v: CaseFormValues,
  initial?: CaseDetail,
): CaseInput {
  const markingScheme: CaseInput["markingScheme"] = [];
  const dgPoints = linesToArray(v.dataGathering);
  if (dgPoints.length) {
    markingScheme.push({ heading: "Data Gathering and Diagnosis", points: dgPoints });
  }
  const edPoints = linesToArray(v.expectedDiagnosis);
  if (edPoints.length) {
    markingScheme.push({ heading: "Expected Diagnosis", points: edPoints });
  }

  const rows = v.bloodTests
    .filter((r) => r.test.trim() || r.result.trim() || r.referenceRange.trim())
    .map((r) => ({
      test: r.test.trim(),
      result: r.result.trim(),
      referenceRange: r.referenceRange.trim(),
      isAbnormal: r.isAbnormal,
    }));

  const baseConsult = initial?.patientData?.recentConsultation;

  return {
    stationNumber: Number(v.stationNumber),
    title: v.title.trim(),
    specialty: v.specialty,
    // Only send when chosen — otherwise let the backend default ("Consultation").
    ...(v.consultationType.trim()
      ? { consultationType: v.consultationType.trim() }
      : {}),
    // Only send when chosen — otherwise let the backend default ("medium").
    ...(v.difficulty.trim()
      ? { difficulty: v.difficulty.trim() as CaseInput["difficulty"] }
      : {}),
    patientData: {
      name: v.patientName.trim(),
      age: Number(v.age),
      gender: v.gender as CaseInput["patientData"]["gender"],
      pastMedicalHistory: linesToArray(v.pastMedicalHistory),
      drugHistory: linesToArray(v.drugHistory),
      recentConsultation: {
        date: v.recentDate.trim() || baseConsult?.date,
        role: v.recentRole.trim() || baseConsult?.role,
        seenBy: v.seenBy.trim(),
        notes: v.recentNotes.trim(),
      },
      bloodTestResults: {
        summary:
          v.bloodTestSummary.trim() ||
          (rows.length ? "" : "No blood tests available"),
        rows,
      },
    },
    patientStory: composePatientStory(v),
    markingScheme,
    exampleExplanation: v.exampleExplanation.trim(),
    management: v.management.map((m) => m.value.trim()).filter(Boolean),
    learningPoints: v.learningPoints.trim(),
    furtherResources: v.resources
      .map((r) => ({ title: r.title.trim(), url: r.url.trim() }))
      .filter((r) => r.title || r.url),
  };
}
