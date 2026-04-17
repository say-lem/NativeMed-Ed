interface recentNotes {
  time: string;
  doctor: string;
  complaint: string;
  examination: string;
  Plan: string;
}

export interface MockCasesPresentation {
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
}
