export type Role = "user" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  mustChangePassword: boolean;
  /** Stored with a leading "@" — the backend normalizes it on register. */
  telegramUsername?: string;
  /** `MM/YY`, e.g. "03/26". Required at register; older accounts may lack it. */
  examSitting?: string;
  whatsappNumber?: string;
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

/** Course access tier (`type: "course"` subscriptions + enrollments). Renamed by the
 *  backend 2026-08-07 from `pdf_only`/`pdf_drive`. Labels live in `@/lib/tiers`. */
export type CourseTier = "mocksessions_only" | "mocksession_and_lectures";

/** Prices for one access tier, in **GBP pounds** (e.g. 49.99) — NOT pence, unlike
 *  `PlanPrice.amount` and `/payments/me`. A missing interval means it isn't offered. */
export interface TierPricing {
  monthly?: number;
  quarterly?: number;
}

/**
 * Per-tier course pricing (replaced the flat `priceMonthly`/`priceQuarterly` on 2026-08-10).
 *
 * ⚠️ **Both tier keys are optional here, deliberately.** The backend guide types them as
 * required, but live data (verified by curl 2026-08-10) disagrees:
 *   - migrated courses carry ONLY `mocksession_and_lectures` — `mocksessions_only` is absent
 *     entirely (not `{}` as the doc claims)
 *   - some older courses have **no `pricing` key at all**
 * Typing these as required would make `course.pricing[tier].monthly` throw on real data.
 * Always go through the helpers in `@/lib/price`.
 */
export type CoursePricing = Partial<Record<CourseTier, TierPricing>>;

/** Course — public shape (`GET /courses`, `GET /courses/:id`). */
export interface Course {
  _id: string;
  title: string;
  description?: string;
  /** Absent on some legacy courses — treat as "not purchasable". */
  pricing?: CoursePricing;
  thumbnailUrl?: string;
  isPublished?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Course — admin shape (`GET /courses/admin/*`, and the `POST`/`PATCH` responses).
 * Since 2026-08-10 these routes DO return the Drive folder links, so the admin edit form
 * can prefill them. Public routes still omit them — never spread an `AdminCourse` into a
 * public-facing component.
 */
export interface AdminCourse extends Course {
  lecturesDriveFolderId?: string;
  mockSessionsDriveFolderId?: string;
}

/**
 * Payload for POST /courses (create) and PATCH /courses/:id (partial update).
 * Create requires: title, description, both Drive links, and **both** tier keys in
 * `pricing`, each with at least one interval. Update merges per tier/interval, so send
 * only what changed — but after the merge both tiers must still have a price.
 */
export interface CourseInput {
  title: string;
  description?: string;
  pricing?: CoursePricing;
  /** Full Drive folder URL or a raw folder ID — backend extracts the ID. */
  lecturesDriveFolderId?: string;
  mockSessionsDriveFolderId?: string;
  isPublished?: boolean;
}

/** Enrollment (GET /enrollments, admin). `userId`/`courseId` come populated;
 *  status is `isActive`; `source` is manual vs payment. Verified 2026-07-08. */
export interface Enrollment {
  _id: string;
  userId?: UserRef | string;
  /** Populated course object, a bare id string, or **null** when the referenced course
   *  has been deleted (populate on a missing doc) — always guard before rendering. */
  courseId?:
    | {
        _id: string;
        title?: string;
        description?: string;
        pricing?: CoursePricing;
        thumbnailUrl?: string;
      }
    | string
    | null;
  isActive?: boolean;
  source?: string; // "manual" | "payment"
  /** Widened to string: legacy records may still carry pre-2026-08-07 tier names. */
  accessTier?: CourseTier | string;
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
  tier?: CourseTier;
  name: string;
  description: string;
  prices: PlanPrice[];
}

/** Stripe subscription status. `past_due` STILL GRANTS ACCESS (payment retry in
 *  progress) — show a warning, don't lock the user out. Widened with `string` because
 *  Stripe can report states we haven't enumerated. */
export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | string;

/** GET /subscriptions/course/:courseId/status — access via a live subscription.
 *  Extra fields added by the backend 2026-08-07; only `active` is guaranteed
 *  (it's absent from the `{ active: false }` form). */
export interface CourseSubStatus {
  active: boolean;
  tier?: CourseTier | string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/** GET /subscriptions/case-bank/status — one subscription unlocks ALL cases.
 *  Same extra fields as the course status, minus `tier`. */
export interface CaseBankStatus {
  active: boolean;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/** GET /subscriptions/me — a user's Stripe subscription. `courseId` (populated)
 *  and `tier` are present only for `type: "course"`. Verified 2026-07-10. */
export interface Subscription {
  _id: string;
  type: "case_bank" | "course";
  userId: string;
  courseId?: { _id: string; title?: string; thumbnailUrl?: string } | null;
  tier?: CourseTier | string;
  billingInterval: string; // "monthly" | "quarterly" | …
  status: SubscriptionStatus;
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
  accessTier?: CourseTier | string;
  accessGrantedAt?: string;
}

export type ReviewStatus = "pending" | "approved" | "revoked";

/** Public review (GET /reviews) — approved-only, used on the homepage. */
export interface Review {
  _id: string;
  name: string;
  examSat: string;
  /** MM/YY, e.g. "03/26" */
  datePassed: string;
  rating: number;
  review: string;
  createdAt: string;
}

/** Admin projection (GET /admin/reviews) — every status, moderation fields included. */
export interface AdminReview extends Review {
  status: ReviewStatus;
  moderatedBy?: UserRef;
  moderatedAt?: string;
  updatedAt: string;
}

/** Payload for POST /reviews (public submit). Always lands as "pending". */
export interface ReviewInput {
  name: string;
  examSat: string;
  datePassed: string;
  rating: number;
  review: string;
}

/**
 * Backend model name is "Activity" (GET /activities, admin CRUD under
 * /admin/activities) — surfaced on the frontend as "Upcoming Events". No status/publish
 * concept: every activity is public and `GET /activities` is the only list endpoint, used
 * by both the homepage and the admin page.
 */
export interface Activity {
  _id: string;
  /** ISO 8601 */
  date: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for POST/PATCH /admin/activities. */
export interface ActivityInput {
  /** yyyy-mm-dd (native `<input type="date">` value) or full ISO. */
  date: string;
  description: string;
}
