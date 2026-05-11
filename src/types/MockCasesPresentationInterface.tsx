interface recentNotes {
  time: string;
  doctor: string;
  complaint: string;
  examination: string;
  Plan: string;
}

interface dataGatheringAndDiagnosis {
  title: string;
  otherThings: string[];
}

interface FurtherResourceLink {
  title: string;
  url: string;
}

interface InvestigationRow {
  test: string;
  result: string;
  referenceRange: string;
  isAbnormal?: boolean;
}

export interface TypeMockCasesPresentation {
  name: string;
  gender: string;
  age: number;
  medicalHistory: string[];
  drugAndAllergyHistory: string[];
  furtherReading: FurtherResourceLink[];
  investigationResults: {
    tableData: InvestigationRow[];
    normalResults: string;
  };
  recentNotes: recentNotes[];
  dataGatheringAndDiagnosis: dataGatheringAndDiagnosis[];
  patientExplanation: string;
  learningPoints: string;
  management: string[];
  safetyNet: string;
  patientBrief: string;
}
