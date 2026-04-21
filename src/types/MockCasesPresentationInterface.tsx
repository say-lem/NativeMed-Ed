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

interface patientsIdeaConcernExpectation {
  tag: string;
  desc: string;
}

export interface TypeMockCasesPresentation {
  name: string;
  gender: string;
  age: number;
  medicalHistory: string[];
  drugAndAllergyHistory: string[];
  furtherReading: string[];
  investigationResults: {
    tableData: { test: string; result: string; referenceRange: string }[];
    normalResults: string;
  };
  recentNotes: recentNotes[];
  dataGatheringAndDiagnosis: dataGatheringAndDiagnosis[];
  patientExplanation: string;
  learningPoints: string;
  management: string[];
  safetyNet: string;
  patientBrief: string;
  socialHistory: string;
  importantNote: string;
  questionsForDoctor: string[];
  patientsIdeaConcernExpectation: patientsIdeaConcernExpectation[];
}
