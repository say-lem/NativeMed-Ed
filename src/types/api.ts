export type Role = "user" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  /** No longer collected at registration (2026-09-13) — optional; set later via profile
   *  settings or by an admin. Older accounts still have it from before the change. */
  phone?: string;
  role: Role;
  mustChangePassword: boolean;
  /** No longer collected at registration (2026-09-13) — optional profile-settings field.
   *  Stored with a leading "@" — the backend normalizes it when set via `PATCH /auth/me`. */
  telegramUsername?: string;
  /** `MM/YY`, e.g. "03/26". Required at register; older accounts may lack it. */
  examSitting?: string;
  whatsappNumber?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload for POST /auth/admin/users — admin only. Creates a new admin account
 *  (`role: "admin"`, `mustChangePassword: true`); the backend auto-generates
 *  `temporaryPassword` and emails it if omitted here. */
export interface CreateAdminInput {
  fullName: string;
  email: string;
  phone: string;
  temporaryPassword?: string;
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

/** GET /cases/overview (public) and GET /cases/admin/overview (admin) — the case bank
 *  presented as a product (title/description/cover image), independent of individual
 *  cases. A singleton — always exactly one. `imageUrl` is absent until an admin uploads
 *  one; `title`/`description` default to "Case Bank Access" / a generic blurb.
 *  `detailedDescription` is a longer write-up for the case bank's own product page
 *  (`/products/case-bank`) — absent until an admin sets it, and deliberately NOT part
 *  of the catalog listing (same split as `Course.detailedDescription`). */
export interface CaseBankOverview {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for PATCH /cases/admin/overview — at least one field required. */
export interface UpdateCaseBankOverviewInput {
  title?: string;
  description?: string;
  detailedDescription?: string;
}

/**
 * Course pricing, in **GBP pounds** (e.g. 49.99) — NOT pence, unlike `PlanPrice.amount`
 * and `/payments/me`. Flat — courses no longer have access tiers (removed by the backend;
 * every course is now a single Drive folder + a single price per interval). A missing
 * interval means it isn't offered; at least one of the two is always set.
 */
export interface CoursePricing {
  monthly?: number;
  quarterly?: number;
}

/** Course — public shape (`GET /courses`, `GET /courses/:id`). */
export interface Course {
  _id: string;
  title: string;
  /** Short summary — shown on course cards/listings. */
  description?: string;
  /** Longer-form write-up — shown on the course detail page only, never inside a card. */
  detailedDescription?: string;
  /** Absent on some legacy courses — treat as "not purchasable". */
  pricing?: CoursePricing;
  thumbnailUrl?: string;
  /** Community invite links — returned on the public course endpoint too (not gated to
   *  enrolled users), and also emailed to a user when they enroll. */
  telegramChannel?: string | null;
  whatsappChannel?: string | null;
  isPublished?: boolean;
  /** New checkouts/plan changes are blocked while true — visibility (`isPublished`) and
   *  existing subscriptions are untouched. Show the "payment not available" message
   *  instead of a plan picker when set. Toggled via `PATCH /courses/:id/{pause,resume}-payments`. */
  paymentsPaused?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Course — admin shape (`GET /courses/admin/*`, and the `POST`/`PATCH` responses).
 * These routes DO return the Drive folder id, so the admin edit form can prefill it.
 * Public routes omit it — never spread an `AdminCourse` into a public-facing component.
 */
export interface AdminCourse extends Course {
  driveFolderId?: string;
}

/**
 * Payload for POST /courses (create) and PATCH /courses/:id (partial update).
 * Create requires: title, description, the Drive link, and at least one of
 * `pricing.monthly`/`pricing.quarterly`. Update merges per interval, so send only what
 * changed — but after the merge at least one interval must still have a price.
 */
export interface CourseInput {
  title: string;
  description?: string;
  detailedDescription?: string;
  pricing?: CoursePricing;
  /** Full Drive folder URL or a raw folder ID — backend extracts the ID. */
  driveFolderId?: string;
  telegramChannel?: string | null;
  whatsappChannel?: string | null;
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
  accessGrantedAt?: string;
  grantedBy?: string;
  subscriptionId?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Live course — a one-time-payment course with a fixed start/end date, as opposed to the
 * subscription-based `Course`. Content (lessons) and Drive-folder access work identically —
 * same content module, same enrollment-grants-Drive-access pattern — just a different
 * parent collection (`/live-courses/:id/content` instead of `/courses/:id/content`).
 */
export interface LiveCourse {
  _id: string;
  title: string;
  /** Short summary — shown on live-course cards/listings. */
  description?: string;
  /** Longer-form write-up — shown on the detail page only, never inside a card. */
  detailedDescription?: string;
  /** GBP pounds — one-time price, not a subscription. */
  price?: number;
  startDate: string;
  endDate: string;
  thumbnailUrl?: string;
  /** Admin-uploaded PDF (e.g. a course schedule / table of contents) shown on the
   *  detail page to everyone, including unauthenticated visitors. Freshly signed on
   *  every read (Cloudinary `authenticated` delivery) — never cache this URL. */
  tocPdfUrl?: string;
  telegramChannel?: string | null;
  whatsappChannel?: string | null;
  isPublished?: boolean;
  /** New purchases are blocked while true — visibility (`isPublished`) and existing
   *  enrollments are untouched. */
  paymentsPaused?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Live course — admin shape (`GET /live-courses/admin/*`, and the `POST`/`PATCH`
 *  responses). These routes DO return the Drive folder id, so the admin edit form can
 *  prefill it. Public routes omit it. */
export interface AdminLiveCourse extends LiveCourse {
  driveFolderId?: string;
}

/**
 * Payload for POST /live-courses (create) and PATCH /live-courses/:id (partial update).
 * Create requires: title, description, price, startDate, endDate, and the Drive link.
 */
export interface LiveCourseInput {
  title: string;
  description?: string;
  detailedDescription?: string;
  price?: number;
  /** ISO 8601 date string. */
  startDate?: string;
  endDate?: string;
  driveFolderId?: string;
  telegramChannel?: string | null;
  whatsappChannel?: string | null;
  isPublished?: boolean;
}

/** Live course enrollment — one-time purchase, no subscription. Same shape/semantics as
 *  `Enrollment` minus `subscriptionId` (live courses have nothing recurring to reference). */
export interface LiveCourseEnrollment {
  _id: string;
  userId?: UserRef | string;
  courseId?:
    | {
        _id: string;
        title?: string;
        description?: string;
        price?: number;
        startDate?: string;
        endDate?: string;
        thumbnailUrl?: string;
      }
    | string
    | null;
  isActive?: boolean;
  source?: string; // "manual" | "payment"
  accessGrantedAt?: string;
  grantedBy?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LessonType = "pdf" | "video" | "audio";

/** A course lesson (GET /courses/:courseId/content). PDF lessons carry a Cloudinary
 *  `fileUrl` (freshly-signed on every read — never cache it). Video/audio lessons carry
 *  a Google-Drive share link the admin pastes in manually — opened externally, never
 *  proxied. `duration` is in **seconds** (video/audio only). */
export interface Lesson {
  _id: string;
  courseId?: string;
  title: string;
  type: LessonType | string;
  fileUrl?: string;
  order?: number;
  duration?: number;
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

/** A payment plan group (GET /payments/plans). */
export interface PaymentPlan {
  type: "case_bank" | "course";
  name: string;
  description: string;
  prices: PlanPrice[];
  /** Live toggle — only present (and meaningful) on the `case_bank` plan group. Merged in
   *  at request time from admin state, not a static plan detail. */
  paymentsPaused?: boolean;
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
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/** GET /subscriptions/case-bank/status — one subscription unlocks ALL cases.
 *  Same extra fields as the course status. */
export interface CaseBankStatus {
  active: boolean;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  billingInterval?: string;
}

/** GET /subscriptions/me — a user's Stripe subscription. `courseId` (populated)
 *  is present only for `type: "course"`. Verified 2026-07-10. */
export interface Subscription {
  _id: string;
  type: "case_bank" | "course";
  userId: string;
  courseId?: { _id: string; title?: string; thumbnailUrl?: string } | null;
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

/** Response of PATCH /subscriptions/case-bank/{pause,resume}-payments — admin. Singleton
 *  settings doc; there is no GET for it, so the frontend only learns the current
 *  `paymentsPaused` value from the response of whichever action was last taken. */
export interface CaseBankSettings {
  _id: string;
  paymentsPaused: boolean;
  createdAt: string;
  updatedAt: string;
}

/** GET /enrollments/check/:courseId — access via an enrollment (manual grant or
 *  a past payment). Verified 2026-07-10. */
export interface EnrollmentCheck {
  enrolled: boolean;
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

/** Payload for POST /reviews/feedback (public submit). Private admin inbox — never shown publicly. */
export interface FeedbackInput {
  name?: string;
  message: string;
}

/** GET /admin/reviews/feedback — admin. Private inbox item; never shown publicly. */
export interface Feedback {
  _id: string;
  name?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface YoutubeLink {
  _id: string;
  title: string;
  url: string;
  order: number;
}

/** GET /homepage — public. `caseNumber` is always the live published-case count, never stored.
 *  `contactEmail`/`contactPhone` are `null` until an admin sets them. */
export interface HomepageData {
  caseNumber: number;
  testimonialsCount: number;
  registrarsCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  /** Social profile/channel links — `null` until an admin sets them. `youtubeUrl` is the
   *  channel/profile link, distinct from `youtubeLinks` (embedded videos) below. */
  facebookUrl: string | null;
  whatsappUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  youtubeLinks: YoutubeLink[];
}

/** Admin mutation responses (PATCH /admin/homepage, youtube-link CRUD) return the raw settings
 *  document — no `caseNumber`, since that's derived and never stored on it. */
export interface HomepageSettings {
  _id: string;
  testimonialsCount: number;
  registrarsCount: number;
  contactEmail?: string;
  contactPhone?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  youtubeLinks: YoutubeLink[];
  faqs: Faq[];
  createdAt: string;
  updatedAt: string;
}

/** Payload for PATCH /admin/homepage. At least one field required (enforced by the schema). */
export interface UpdateHomepageStatsInput {
  testimonialsCount?: number;
  registrarsCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

/** Payload for POST /admin/homepage/youtube-links (all required) and PATCH .../:linkId (partial). */
export interface YoutubeLinkInput {
  title: string;
  url: string;
  order?: number;
}

/** GET /homepage/faqs (public) — sorted by `order`. */
export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

/** Payload for POST /admin/homepage/faqs (question/answer required) and PATCH .../:faqId
 *  (partial — at least one field). */
export interface FaqInput {
  question?: string;
  answer?: string;
  order?: number;
}

/** GET /homepage/terms and /homepage/legal-disclaimer (public) — same shape from the
 *  admin GET/PATCH equivalents. `content` is `""` and `updatedAt` is `null` until an
 *  admin has ever saved one. */
export interface LegalPageContent {
  content: string;
  updatedAt: string | null;
}

/** GET /homepage/founder-bio (public) and its admin GET/PATCH equivalent — the About
 *  page's "About the Founder" section. `title` is the short line shown under the photo
 *  (e.g. "Dr Clinton Ohaa — MBBS, MRCS, MRCGP, MBA"); `content` is the longer bio prose.
 *  Both `title` and `imageUrl` are `null` until an admin has ever set them. */
export interface FounderBioContent {
  content: string;
  title: string | null;
  imageUrl: string | null;
  updatedAt: string | null;
}

/** Payload for PATCH /admin/homepage/founder-bio — at least one field required. */
export interface UpdateFounderBioInput {
  content?: string;
  title?: string;
}

export type FreeProductType = "link" | "pdf" | "blog";

/**
 * GET /free-products (public) and /admin/free-products (admin, incl. drafts). Mixed types
 * in one list, ordered by `order`. `description` is required for `link`/`pdf` but optional
 * for `blog` (the written `content` carries the material instead).
 *
 * For `pdf` products, `fileUrl` is a freshly-signed short-lived Cloudinary download link —
 * never cache it. `blog` products instead carry `content` (the article body) and
 * `coverImageUrl` (a normal, cacheable CDN image URL — no signing needed).
 */
export interface FreeProduct {
  _id: string;
  title: string;
  description?: string;
  type: FreeProductType;
  fileUrl?: string;
  content?: string;
  coverImageUrl?: string;
  isPublished: boolean;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for POST /admin/free-products (creates a `link` product). */
export interface CreateLinkFreeProductInput {
  title: string;
  description: string;
  fileUrl: string;
  order?: number;
}

/** Payload for PATCH /admin/free-products/:id. `fileUrl` only accepted on `link` products;
 *  `content` only accepted on `blog` products — the backend 400s otherwise. */
export interface UpdateFreeProductInput {
  title?: string;
  description?: string;
  fileUrl?: string;
  content?: string;
  order?: number;
  isPublished?: boolean;
}

/** Backend activities are displayed as events; missing publication flags remain public. */
export interface Activity {
  time?: string;
  activityType?: string;
  activityStatus?: string;
  courseId?: string | null;
  isPublished?: boolean;
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
  time?: string;
  activityType?: string;
  activityStatus?: string;
  courseId?: string | null;
  isPublished?: boolean;
  /** yyyy-mm-dd (native `<input type="date">` value) or full ISO. */
  date: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog — GET /products (public). Everything a user can pay for, one flat list,
// discriminated by `type`. Read-only; aggregates courses/booking/case-bank.
// ─────────────────────────────────────────────────────────────────────────────

export interface CatalogCourseProduct {
  type: "course";
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  pricing?: CoursePricing;
}

export interface CatalogLiveCourseProduct {
  type: "live_course";
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  /** GBP pounds — one-time price, not a subscription. */
  price: number;
  startDate: string;
  endDate: string;
}

export interface CatalogOneOnOneProduct {
  type: "one_on_one";
  _id: string;
  title: string;
  description: string;
  /** GBP pounds, informational only — booking has no payment gate. */
  price: number;
}

/** Always exactly one entry, and it has no `_id` — the case bank isn't a persisted doc.
 *  `title`/`description`/`imageUrl` come from the admin-editable `CaseBankOverview`. */
export interface CatalogCaseBankProduct {
  type: "case_bank";
  title: string;
  description: string;
  imageUrl?: string | null;
  prices: PlanPrice[];
  /** Live count of published cases — never stored. */
  caseCount: number;
}

export type CatalogProduct =
  | CatalogCourseProduct
  | CatalogLiveCourseProduct
  | CatalogOneOnOneProduct
  | CatalogCaseBankProduct;

// ─────────────────────────────────────────────────────────────────────────────
// Booking — one-on-one session products. Public reads at /booking; booking a
// slot requires login; admin management at /admin/booking.
// ─────────────────────────────────────────────────────────────────────────────

/** One of the product's `availableTimes`, tagged for a specific date. */
export interface BookingTimeSlot {
  time: string;
  isAvailable: boolean;
}

/** GET /booking, /booking/:id (public). Only dates with at least one available time are
 *  included at all; `times` covers every one of the product's `availableTimes` so the
 *  frontend can render the full set and disable the ones already booked on that date. */
export interface BookingAvailableDate {
  _id: string;
  /** ISO 8601, day-only (time component is midnight UTC). */
  date: string;
  times: BookingTimeSlot[];
}

export interface BookingProduct {
  _id: string;
  title: string;
  description: string;
  /** Longer-form write-up shown on the session's detail page — `description` stays the
   *  short summary used in listings/cards. Markdown, same convention as course/case-bank
   *  overview `detailedDescription`. */
  detailedDescription?: string;
  imageUrl?: string;
  price: number;
  /** Reusable HH:mm options offered on every date in the pool. */
  availableTimes: string[];
  availableDates: BookingAvailableDate[];
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /admin/booking/products (admin) — the raw stored date entry, every date regardless
 *  of booking state. `bookedTimes` is the subset of the product's `availableTimes` already
 *  taken on this specific date. */
export interface AdminBookingAvailableDate {
  _id: string;
  date: string;
  bookedTimes: string[];
}

export interface AdminBookingProduct extends Omit<BookingProduct, "availableDates"> {
  availableDates: AdminBookingAvailableDate[];
}

/** Payload for POST /admin/booking/products. */
export interface CreateBookingProductInput {
  title: string;
  description: string;
  detailedDescription?: string;
  price: number;
  availableTimes?: string[];
  isPublished?: boolean;
}

/** Payload for PATCH /admin/booking/products/:id. Replaces `availableTimes` wholesale
 *  if provided — never a merge. */
export type UpdateBookingProductInput = Partial<CreateBookingProductInput>;

/** Payload for POST /booking/:id/book. `date` is yyyy-mm-dd, `time` one of the
 *  product's `availableTimes`. `successUrl`/`cancelUrl` default backend-side if omitted —
 *  always pass them explicitly (same convention as `CheckoutInput`) so Stripe returns to
 *  the right origin. */
export interface BookSessionInput {
  date: string;
  time: string;
  successUrl?: string;
  cancelUrl?: string;
}

/** `pending` — checkout started, not yet paid (or abandoned and not yet expired).
 *  `confirmed` — Stripe confirmed payment via webhook. `cancelled` — checkout expired
 *  unpaid; the slot was released back into the pool. */
export type SessionBookingStatus = "pending" | "confirmed" | "cancelled";

/** POST /booking/:id/book response — a booking is NOT confirmed at this point. Redirect
 *  the browser to `url` to complete payment; the booking becomes `confirmed` only once
 *  Stripe's webhook fires. `url` mirrors Stripe's own type (`string | null`). */
export interface BookingCheckout {
  bookingId: string;
  sessionId: string;
  url: string | null;
}

export interface SessionBooking {
  _id: string;
  productId: string;
  userId: string;
  date: string;
  time: string;
  status: SessionBookingStatus;
  stripeCheckoutSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /admin/booking/bookings — productId/userId populated. */
export interface AdminSessionBooking {
  _id: string;
  productId: { _id: string; title: string; price: number } | null;
  userId: { _id: string; fullName: string; email: string } | null;
  date: string;
  time: string;
  status: SessionBookingStatus;
  stripeCheckoutSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /booking/me — auth. The signed-in user's own bookings, newest date first, ANY
 *  status — a `pending` entry hasn't been paid for (yet); a `cancelled` one expired
 *  unpaid. `productId` is `null` if the session product was since deleted.
 *  `stripeCheckoutSessionId` is how `/payment/success` matches a returning Stripe
 *  redirect back to the specific booking it just paid for. */
export interface MyBooking {
  _id: string;
  productId: { _id: string; title: string; description: string; price: number } | null;
  userId: string;
  date: string;
  time: string;
  stripeCheckoutSessionId?: string;
  status: SessionBookingStatus;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slot availability requests — a user reaching out about a BookingProduct that
// currently has no open (date, time) slot. Only accepted when the product genuinely
// has nothing bookable — POST /booking/:id/request-slot 400s otherwise.
// ─────────────────────────────────────────────────────────────────────────────

export type SlotRequestStatus = "pending" | "resolved";

/** Payload for POST /booking/:id/request-slot. `preferredDates` — 1 to 10 dates,
 *  yyyy-mm-dd (coerced to Date backend-side). `examSitting` is `MM/YY`, same format/regex
 *  as `User.examSitting`. */
export interface RequestSlotAvailabilityInput {
  name: string;
  email: string;
  examSitting: string;
  preferredDates: string[];
}

export interface SlotAvailabilityRequest {
  _id: string;
  productId: string;
  userId: string;
  name: string;
  email: string;
  examSitting: string;
  preferredDates: string[];
  status: SlotRequestStatus;
  createdAt: string;
  updatedAt: string;
}

/** GET /admin/booking/slot-requests — productId/userId populated. */
export interface AdminSlotAvailabilityRequest {
  _id: string;
  productId: { _id: string; title: string } | null;
  userId: { _id: string; fullName: string; email: string } | null;
  name: string;
  email: string;
  examSitting: string;
  preferredDates: string[];
  status: SlotRequestStatus;
  createdAt: string;
  updatedAt: string;
}
