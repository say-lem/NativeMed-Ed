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

/** GET /admin/dashboard → data. `recent*` item shapes unknown (empty in prod). */
export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalCourses: number;
  totalEnrollments: number;
  paidEnrollments: number;
  manualEnrollments: number;
  totalRevenue: number;
  recentPayments: unknown[];
  recentEnrollments: unknown[];
}

export type Difficulty = "easy" | "medium" | "hard";
export type Gender = "male" | "female" | "other";

export interface PatientData {
  name: string;
  age: number;
  gender: Gender;
}

/** Populated form of `createdBy` returned by admin routes. */
export interface UserRef {
  _id: string;
  fullName: string;
  email: string;
}

export interface Case {
  _id: string;
  stationNumber: number;
  title: string;
  specialty: string;
  difficulty: Difficulty;
  imageUrl?: string;
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
  isAbnormal?: boolean;
}

export interface BloodTestResults {
  summary: string;
  rows: BloodTestRow[];
}

export interface RecentConsultation {
  date?: string;
  seenBy: string;
  role?: string;
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
  stationImageUrl?: string;
  createdBy: string | UserRef;
  patientStory: string;
  exampleExplanation: string;
  learningPoints: string;
  management: string[];
  markingScheme: MarkingSchemeSection[];
  furtherResources: FurtherResource[];
  patientData: PatientDataDetail;
  updatedAt: string;
}

/** Generic pagination envelope returned by list endpoints. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Admin case list projection (GET /cases/admin/all) — user list + admin fields. */
export interface AdminCase extends Case {
  consultationType: string;
  isPublished: boolean;
  stationImageUrl?: string;
  createdBy: UserRef;
  updatedAt: string;
}

/** Row from GET /subscriptions/subscribers (admin) — plain array, NOT paginated. */
export interface Subscriber {
  name: string;
  email: string;
  subscriptionPlan: string;
  subscribedTo: string;
  expiryDate: string;
  status: string; // "active" | "expired" | ...
}

/** Payload for POST /cases (create) and PATCH /cases/:id (partial update). */
export interface CaseInput {
  stationNumber: number;
  title: string;
  specialty: string;
  consultationType?: string;
  difficulty?: Difficulty;
  isPublished?: boolean;
  patientData: {
    name: string;
    age: number;
    gender: Gender;
    pastMedicalHistory: string[];
    drugHistory: string[];
    recentConsultation: {
      date?: string;
      seenBy: string;
      role?: string;
      notes: string;
    };
    bloodTestResults: {
      summary: string;
      rows: BloodTestRow[];
    };
  };
  patientStory: string;
  markingScheme: MarkingSchemeSection[];
  exampleExplanation: string;
  management: string[];
  learningPoints: string;
  furtherResources: FurtherResource[];
}

/** Course (GET /courses). Shape verified against live data 2026-06-25. */
export interface Course {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  isPublished?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload for POST /courses (create) and PATCH /courses/:id (partial update). */
export interface CourseInput {
  title: string;
  description?: string;
  price?: number;
}

/** Enrollment (GET /enrollments, admin). `userId`/`courseId` come populated;
 *  status is `isActive`; `source` is manual vs payment. Verified 2026-07-08. */
export interface Enrollment {
  _id: string;
  userId?: UserRef | string;
  courseId?:
    | {
        _id: string;
        title?: string;
        description?: string;
        price?: number;
        thumbnailUrl?: string;
      }
    | string;
  isActive?: boolean;
  source?: string; // "manual" | "payment"
  accessTier?: string; // "pdf_only" | "pdf_drive"
  accessGrantedAt?: string;
  grantedBy?: string;
  subscriptionId?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LessonType = "pdf" | "video";

/** A course lesson (GET /courses/:courseId/content). Verified 2026-07-10:
 *  PDF lessons carry a Cloudinary `fileUrl`; video lessons a Google-Drive link. */
export interface Lesson {
  _id: string;
  courseId?: string;
  title: string;
  type: LessonType | string;
  fileUrl?: string;
  order?: number;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** A single price option within a payment plan (GET /payments/plans).
 *  `amount` is in minor units (pence). Verified 2026-07-10. */
export interface PlanPrice {
  amount: number;
  currency: string; // e.g. "gbp"
  interval: string; // "monthly" | "quarterly"
  stripePriceId: string;
  label: string; // pre-formatted, e.g. "£69.99 / month"
}

/** A payment plan group (GET /payments/plans). `tier` is present only for
 *  `type: "course"` plans. Verified 2026-07-10. */
export interface PaymentPlan {
  type: "case_bank" | "course";
  tier?: "pdf_only" | "pdf_drive";
  name: string;
  description: string;
  prices: PlanPrice[];
}

/** GET /subscriptions/course/:courseId/status — access via a live subscription.
 *  Verified 2026-07-10. */
export interface CourseSubStatus {
  active: boolean;
}

/** GET /subscriptions/case-bank/status — one subscription unlocks ALL cases.
 *  Verified 2026-07-10. */
export interface CaseBankStatus {
  active: boolean;
}

/** GET /subscriptions/me — a user's Stripe subscription. `courseId` (populated)
 *  and `tier` are present only for `type: "course"`. Verified 2026-07-10. */
export interface Subscription {
  _id: string;
  type: "case_bank" | "course";
  userId: string;
  courseId?: { _id: string; title?: string; thumbnailUrl?: string };
  tier?: "pdf_only" | "pdf_drive";
  billingInterval: string; // "monthly" | "quarterly" | …
  status: string; // "active" | "canceled" | …
  cancelAtPeriodEnd: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /enrollments/check/:courseId — access via an enrollment (manual grant or
 *  a past payment). `accessTier` is the level granted. Verified 2026-07-10. */
export interface EnrollmentCheck {
  enrolled: boolean;
  accessTier?: "pdf_only" | "pdf_drive";
  accessGrantedAt?: string;
}
