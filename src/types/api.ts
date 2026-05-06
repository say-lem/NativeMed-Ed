export type Role = "user" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  mustChangePassword: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthSuccessData = AuthTokens & { user: User };

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type FormActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export interface JwtPayload {
  _id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface Specialty {
  specialty: string;
  count: number;
}

export type Difficulty = "easy" | "medium" | "hard";
export type Gender = "male" | "female";

export interface PatientData {
  name: string;
  age: number;
  gender: Gender;
}

export interface Case {
  _id: string;
  stationNumber: number;
  title: string;
  specialty: string;
  difficulty: Difficulty;
  patientData: PatientData;
  createdAt: string;
}

export interface CasesPage {
  items: Case[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FurtherResource {
  title: string;
  url: string;
}

export interface MarkingSchemeSection {
  heading: string;
  points: string[];
}

export interface BloodTestRow {
  test?: string;
  result?: string;
  referenceRange?: string;
}

export interface BloodTestResults {
  summary: string;
  rows: BloodTestRow[];
}

export interface RecentConsultation {
  seenBy: string;
  notes: string;
}

export interface PatientDataDetail extends PatientData {
  pastMedicalHistory: string[];
  drugHistory: string[];
  recentConsultation: RecentConsultation;
  bloodTestResults: BloodTestResults;
}

export interface CaseDetail extends Case {
  consultationType: string;
  isPublished: boolean;
  patientStory: string;
  exampleExplanation: string;
  learningPoints: string;
  management: string[];
  markingScheme: MarkingSchemeSection[];
  furtherResources: FurtherResource[];
  patientData: PatientDataDetail;
  updatedAt: string;
}
