# Native Medical Education — Frontend (Next.js App Router)

Internal reference for integrating with the Native Med backend. Keep this in sync with the
backend integration guides. When the backend doc and the code disagree, the backend doc wins —
update the code, then update this file.

---

## 0. API source of truth & full surface

- Canonical API reference: [docs/nativemed-api.postman_collection.json](docs/nativemed-api.postman_collection.json)
  (exported NativeMed Postman collection). It is BROADER than the Cases doc — trust it + the live API
  over any prose doc. The collection has request shapes but NOT response schemas; confirm response
  shapes against the live API when integrating a new endpoint.
- The backend exposes the modules below (Payments + Subscriptions added 2026-06-25). See §7 for the
  current integration state (what's wired vs still mock).

| Module         | Key endpoints                                                                                                                                                                                                                                                                | Auth  | Notes                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------- |
| Health         | `GET /health`                                                                                                                                                                                                                                                                | none  |                                                                                          |
| Auth           | `POST /auth/{register,login,refresh-token,logout,forgot-password,reset-password,change-password,logout-all}`, `GET/PATCH /auth/me`                                                                                                                                           | mixed | register/login/refresh/forgot/reset are public; me/change-password/logout-all need token |
| Auth admin     | `POST/GET /auth/admin/users`, `GET/PATCH /auth/admin/users/:userId`, `PATCH /auth/admin/users/:userId/toggle-status`                                                                                                                                                         | admin | user management (note: also duplicated under `/admin/users`)                             |
| Courses        | `GET /courses` (PUBLIC, **published-only** plain array — NOT paginated), `GET /courses/:id` (auth, **published-only**), `GET /courses/admin/all` (admin, **paginated, incl. drafts**), `GET /courses/admin/:id` (admin, incl. drafts), `POST/PATCH/DELETE /courses/:id` (admin), `PATCH /courses/:id/{thumbnail,publish}` (admin)                                                             | mixed | `POST` body: `{ title, description, price }` (all required). thumbnail = multipart field `thumbnail`. **Admin must use `/courses/admin/*` to see drafts** — `/courses` + `/courses/:id` hide unpublished (mirrors Cases). |
| Course Content | `GET /courses/:courseId/content[/:id]` (auth); **two create endpoints** — `POST .../content/upload-pdf` (admin, multipart: `file,title,order,type=pdf`, Cloudinary) and `POST .../content/drive-link` (admin, JSON: `{title,type,fileUrl,order,duration}`); `PATCH/DELETE .../content/:id` (admin)                                                                                | mixed | PDF lessons are uploaded; video lessons are Google-Drive links. lesson `type` e.g. `"video"`/`"pdf"` |
| Cases          | see §4                                                                                                                                                                                                                                                                       | mixed | only module with a written integration doc + frontend integration                        |
| Enrollments    | `GET /enrollments/me` (auth, array; `courseId` **populated**), `GET /enrollments/check/:courseId` (auth), `GET /enrollments` + `/course/:courseId` + `/user/:userId` (admin), `POST /enrollments/{manual,revoke}` (admin, `{ userId, courseId }`), `PATCH /enrollments/:id/restore` (admin) | mixed | course access grants; backs the member **My Courses**. An enrollment = access to a course (via payment OR admin grant); ≠ a subscription (§7) |
| Admin          | `GET /admin/dashboard`, `GET /admin/users[/:userId]`, `PATCH /admin/users/:userId/toggle-status`                                                                                                                                                                             | admin | dashboard stats + user mgmt                                                              |
| Payments       | `GET /payments/plans` (public), `POST /payments/checkout` (auth; `{ type:"case_bank"\|"course", interval, tier?, courseId?, successUrl, cancelUrl }`), `POST /payments/billing-portal` (auth), `GET /payments/me` (auth, paginated), `POST /payments/webhook` (Stripe, raw body + `Stripe-Signature`)                                                                                | mixed | **Stripe** checkout. `type:"case_bank"` → Case Bank sub; `type:"course"` + `tier:"pdf_only"\|"pdf_drive"` → course. `interval`: `monthly`/`quarterly`/… |
| Subscriptions  | `GET /subscriptions/plans` (public), `GET /subscriptions/me` (auth), `GET /subscriptions/case-bank/status` (auth), `GET /subscriptions/course/:courseId/status` (auth), `GET /subscriptions/subscribers` (admin)                                                              | mixed | **`/subscriptions/subscribers` is the REAL source for the admin Subscribers screen** — NOT `/admin/users`. A user ≠ a subscriber. `/subscriptions/me` + `…/status` back the marketplace "My Subscriptions"/access gating |

- Admin **Subscribers** screen is wired to `GET /subscriptions/subscribers` (plain array; a user is NOT
  a subscriber — do NOT back it with `/admin/users`). Row shape: `{ name, email, subscriptionPlan,
  subscribedTo, expiryDate, status }`. Admin **casebank**, **courses** (via `/courses/admin/all`),
  **subscribers**, **users** (`/admin/users`), and **enrollments** (`/enrollments`) lists + the admin
  **dashboard** stats are all wired.
- **Response shapes verified against live data (as of 2026-07-10):** Cases (§4), Courses (list + detail),
  Payments **plans** (§8), Subscriptions (**subscribers**, **plans**, **`/me`**, **course/case-bank
  `status`** = `{ active: boolean }`), Enrollments (**`/enrollments/me`** + **`/check/:id`**, §8), Course
  Content (§8). **Still unverified:** `POST /payments/checkout` response, `POST /payments/billing-portal`
  response, `GET /payments/me`.
- **Two backend blockers** the frontend is waiting on (both built client-side, both fail at the backend):
  1. **Stripe checkout** — `/payments/plans` returns dummy price IDs (`price_dummy_*`), so
     `POST /payments/checkout` 500s ("Something went wrong"). Needs real Stripe prices.
  2. **Course PDF delivery** — lesson `fileUrl`s are **private Cloudinary** assets (`401 deny or ACL
     failure`), so our proxy can't stream them. Needs a signed URL or a backend stream endpoint. See §7.

## 1. Environment & API base URL

- API base URL is built in [src/lib/api.ts](src/lib/api.ts) and [src/proxy.ts](src/proxy.ts) as:
  ```ts
  const baseURL = `${process.env.API_URL ?? "http://localhost:5000"}/api/v1`;
  ```
- `API_URL` is the backend **host only** — no trailing slash, no `/api/v1` (the code appends `/api/v1`).
- Local config lives in `.env.local` (gitignored). Currently:
  ```
  API_URL=https://nativemed.onrender.com
  ```
- **Env vars are read only at `next dev` startup** — restart the dev server after editing `.env.local`.
- Render free tier spins down when idle; the first request after a quiet period can take ~30–60s.

## 2. Auth & request layer

- Calls to the backend run **server-side** (services are `import "server-only"`); Server Actions /
  Server Components reach the API, not the browser.
- Tokens are stored in **httpOnly cookies** (`accessToken`, `refreshToken`) — see [src/lib/session.ts](src/lib/session.ts).
  - `secure` is on only in production; `sameSite: lax`; access TTL 15 min, refresh TTL 7 days.
- The shared axios instance ([src/lib/api.ts](src/lib/api.ts)):
  - Request interceptor attaches `Authorization: Bearer <accessToken>` from the cookie.
  - Response interceptor: on `401` for a **non-auth** endpoint, it calls `/auth/refresh-token` once,
    retries the original request with the new access token. Auth endpoints
    (`/auth/login`, `/auth/register`, `/auth/refresh-token`) are excluded from the retry.
  - In a Server Component, refreshed tokens can't be written back to cookies (cookies are read-only
    there) — the code retries in-memory and swallows the cookie-write error.
- **Token refresh + rotation is handled in [src/proxy.ts](src/proxy.ts)** (runs on every matched
  route). NOTE on convention: this is Next.js **16**, where the old `middleware.ts` is DEPRECATED —
  the file is `proxy.ts`, exports a `proxy` function (+ `config`), and lives at **`src/proxy.ts`**
  (next to `src/app`, NOT repo root — a root-level file is not picked up when the app is in `src/`).
  Do not rename it back to `middleware.ts`.
  The backend **rotates** the refresh token and invalidates the old one on each refresh; the proxy is
  the only place that can both refresh AND persist the rotated cookies (Server Components can't write
  cookies). On a matched request: if the access token is valid (30s leeway) it passes through; if
  expired/missing it refreshes via `/auth/refresh-token`, writes the new access+refresh cookies on
  the response, and forwards the new access token to the render. If refresh fails it clears cookies
  and redirects to `/login?redirect=<original-path+query>` (so login can send the user back — see
  the return-to-page note below). The axios interceptor remains a fallback for 401s during an
  in-render API call. **The matcher must list every protected route** (marketplace + admin).
- **Return-to-page-after-login**: `redirectToLogin` (proxy) appends `?redirect=<path>` with the
  originally-requested path+query. `login`/`register` actions take an optional `redirectTo` and route
  there via [src/lib/redirect.ts](src/lib/redirect.ts) `safeRedirect(target, fallback)` — which only
  allows **internal absolute paths** (rejects `//host`, `/\host`, absolute URLs → open-redirect guard),
  falling back to the role default (admin `/admin-dashboard`, else `/dashboard`). `AuthForm` reads
  `redirect` from `searchParams` (server-side, in the page — no `useSearchParams`) and preserves it
  across the login↔register footer links. So a logged-out "Get this course" → `/courses/:id` bounces
  through login and lands back on the course.
- **Already-signed-in guard**: `/login` + `/register` pages call `getOptionalUser()` and, if a user
  exists, `redirect()` them away (to `?redirect=` target if safe, else the role default) — a logged-in
  user can't land on the auth forms.
- Every case endpoint requires `Authorization: Bearer <accessToken>`.
- Standard envelope on **every** response:
  ```ts
  // success
  { success: true, message: string, data: T }
  // failure
  { success: false, message: string, errors?: Record<string,string[]> }  // errors only on validation
  ```
- `ApiResponse<T>` discriminates on `success`. Always check `res.success` before reading `res.data`.

## 3. Common status codes

| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| 200    | OK                                                            |
| 201    | Created                                                       |
| 400    | Bad request                                                   |
| 401    | No/expired token → refresh then retry, else redirect to login |
| 403    | Authenticated but not admin                                   |
| 404    | Not found                                                     |
| 413    | Image > 5 MB                                                  |
| 422    | Validation failed — `errors: Record<string, string[]>`        |
| 429    | Rate limit (cases 200/15min; courses 150/15min)               |
| 500    | Server error                                                  |

---

## 4. Cases module — backend contract

Base: `/api/v1/cases`. Two visibility states:

- **Draft** (`isPublished: false`) — admins only.
- **Published** (`isPublished: true`) — all authenticated users.

> IMPORTANT: `GET /cases` and `GET /cases/specialties` return **only published** cases. If the DB has
> no published cases, the user-facing Case Bank is correctly empty. Admins create via `POST /cases`
> then publish via `PATCH /cases/:id/publish`. To see drafts use the admin routes.
>
> **Case Bank subscription (5 free):** the backend gates `GET /cases` by subscription — an unsubscribed
> user gets **5 cases**; a subscribed user gets **all**. `GET /cases/:id` only returns a case the user
> may view. This is enforced backend-side, so the frontend does NOT paywall the case detail; it shows a
> subscribe **upsell** on the Case Bank list instead (§7).

### Enums / allowed values

- **difficulty**: `easy | medium | hard` (default `medium`)
- **gender**: `male | female | other`
- **consultationType** (free string; common): `Video Consultation`, `Telephone Consultation`,
  `Face-to-Face Consultation`, `Consultation` (default `Consultation`)
- **specialties** — ALWAYS treat `GET /cases/specialties` as the source of truth, NOT the backend
  doc. The doc lists only 12, but the live API returns **16** (verified 2026-06-20). Exact strings:
  ```
  Cardiology
  Dermatology/Allergy/Immunology
  Elderly Medicine/ Palliative
  Endocrine and Nephrology
  ENT & Eye
  Ethics
  Gastroenterology/ Haematology
  Genetics
  Gynaecology/ Women's Health
  Men's Health
  Mental Health
  Neurology
  Paediatrics
  Respiratory
  Rheumatology/ Musculoskeletal
  Travel Health/ Infectious Disease
  ```
  The doc omitted Cardiology, Genetics, Men's Health, Neurology. Don't hardcode/whitelist against the
  doc's subset. Note irregular spaces/slashes (e.g. `"Elderly Medicine/ Palliative"`). When used as a
  URL **path segment**, `encodeURIComponent` it. As a query param, axios/fetch encode automatically.

### Pagination envelope (all list endpoints)

```ts
{ items: CaseListItem[], total, page, limit, totalPages }
```

Query params: `page` (default 1), `limit` (default 12, **max 50**), `specialty` (case-insensitive),
`difficulty`, `search` (full-text on title, specialty, patient name, learning points).

### Data model — full Case (GET /cases/:id, /cases/admin/:id)

```ts
{
  _id: string;
  stationNumber: number;        // ordering; unique per station; int >= 1
  title: string;
  consultationType: string;
  specialty: string;
  difficulty: "easy"|"medium"|"hard";
  isPublished: boolean;
  imageUrl?: string;            // Cloudinary — cover/banner (optional)
  stationImageUrl?: string;     // Cloudinary — station image (optional)
  createdBy: string | { _id, fullName, email };  // populated on admin routes
  createdAt: string; updatedAt: string;          // ISO 8601
  patientData: PatientData;
  patientStory: string;         // markdown
  markingScheme: { heading: string; points: string[] }[];
  exampleExplanation: string;   // markdown
  management: string[];
  learningPoints: string;       // markdown
  furtherResources: { title: string; url: string }[];
}

PatientData {
  name: string; age: number /*0–130*/; gender: "male"|"female"|"other";
  pastMedicalHistory: string[]; drugHistory: string[];
  recentConsultation: { date?: string; seenBy: string; role?: string; notes: string };
  bloodTestResults: { summary: string; rows: BloodTestRow[] };
}
BloodTestRow { test: string; result: string; referenceRange: string; isAbnormal: boolean }
```

`imagePublicId` / `stationImagePublicId` are internal and **never** returned.

### List projections (lightweight — heavy fields excluded)

User list (`GET /cases`):

```ts
{ _id, stationNumber, title, specialty, difficulty, imageUrl?,
  patientData: { name, age, gender }, createdAt }
```

Admin list (`GET /cases/admin/all`) = user list **plus**:

```ts
{ consultationType, isPublished, stationImageUrl?,
  createdBy: { _id, fullName, email }, updatedAt }
```

Always fetch full detail with `GET /cases/:id` when opening a case — do not render full detail
from the list.

### Endpoints

| Method & path                     | Auth  | Notes                                                                                      |
| --------------------------------- | ----- | ------------------------------------------------------------------------------------------ |
| `GET /cases/specialties`          | user  | Published-only specialties + counts: `[{ specialty, count }]`. Build the filter from this. |
| `GET /cases`                      | user  | Paginated published list. Params: `page, limit, specialty, difficulty, search`.            |
| `GET /cases/specialty/:specialty` | user  | Same as `?specialty=` but path param (URL-encode it).                                      |
| `GET /cases/:id`                  | user  | Full published case. 404 if not found or not published.                                    |
| `GET /cases/admin/all`            | admin | All cases incl. drafts; `createdBy` populated.                                             |
| `GET /cases/admin/:id`            | admin | Full case incl. drafts; `createdBy` populated.                                             |
| `POST /cases`                     | admin | Create (draft unless `isPublished:true`). JSON or multipart — see below.                   |
| `PATCH /cases/:id`                | admin | Partial update. **Arrays replace, not merge** (see notes).                                 |
| `PATCH /cases/:id/image`          | admin | Multipart field `image`. Replaces cover; resized 800×450. Returns `{ imageUrl }`.          |
| `PATCH /cases/:id/station-image`  | admin | Multipart field `stationImage`. Resized 800×600. Returns `{ stationImageUrl }`.            |
| `PATCH /cases/:id/publish`        | admin | Toggle publish; no body. Returns `{ _id, title, isPublished }`.                            |
| `POST /cases/:id/duplicate`       | admin | Draft copy: `"Copy of …"`, next stationNumber, no images, `isPublished:false`.             |
| `DELETE /cases/:id`               | admin | Hard delete (+ Cloudinary images). `data: null`.                                           |

### POST /cases — create field rules

Required: `stationNumber` (int ≥1, unique), `title`, `specialty` (exact enum), `patientData`,
`patientStory`, `markingScheme` (≥1 section, each ≥1 point), `exampleExplanation`,
`management` (≥1 item), `learningPoints`.
Optional w/ defaults: `consultationType` ("Consultation"), `difficulty` ("medium"),
`isPublished` (false), `furtherResources` ([]).

**Multipart create (with images):** send the **entire JSON body as a string** in a `payload`
field, plus optional `image` and `stationImage` files (jpg/png/webp, ≤5 MB). Do NOT split JSON into
separate form fields. Never set `Content-Type` manually with `FormData` (browser sets the boundary).

```js
const fd = new FormData();
fd.append("payload", JSON.stringify(caseData));
fd.append("image", coverFile); // optional
fd.append("stationImage", stationFile); // optional
```

---

## 5. Frontend integration notes / gotchas

1. **List → detail**: never render full case from the list projection; fetch `GET /cases/:id`.
2. **Markdown** (use a markdown renderer): `patientStory`, `exampleExplanation`, `learningPoints`,
   `recentConsultation.notes`.
3. **Blood test table**: render `bloodTestResults.rows`; highlight rows where `isAbnormal: true`.
4. **Image fallback**: `imageUrl` / `stationImageUrl` may be missing — always show a placeholder.
5. **Specialty URL encoding**: `encodeURIComponent` for path segments; query params auto-encode.
6. **PATCH replace vs merge**: scalars and nested `patientData` sub-fields **merge** (dot-notation);
   **array fields replace entirely** (`markingScheme`, `management`, `furtherResources`,
   `pastMedicalHistory`, `drugHistory`) — always send the full updated array.
7. **Admin vs user routes**: users hitting `/cases/admin/*` get `403`. Use admin routes only for
   the admin UI.

## 6. Where things live (current frontend)

- Types: [src/types/api.ts](src/types/api.ts) (incl. `CaseInput`, `Course`, `PaymentPlan`/`PlanPrice`,
  `CourseSubStatus`/`CaseBankStatus`, `EnrollmentCheck`, `Enrollment`, `Lesson`).
- Services (all `import "server-only"`):
  - [cases.service.ts](src/services/cases.service.ts) — user reads + all admin case ops.
  - [courses.service.ts](src/services/courses.service.ts) — `getCourses`/`getCourse` (user), admin
    `getAdminCourses`/`getAdminCourse`/create/update/delete/publish/thumbnail, + Course Content ops.
  - [payments.service.ts](src/services/payments.service.ts) — `getPaymentPlans`, `createCheckout`,
    `getBillingPortal`, `getMyPayments`.
  - [subscriptions.service.ts](src/services/subscriptions.service.ts) — `getSubscribers` (admin),
    `getMySubscriptions`, `getCourseSubStatus`, `getCaseBankStatus`.
  - [enrollments.service.ts](src/services/enrollments.service.ts) — `getMyEnrollments`,
    `checkEnrollment` (user), `getEnrollments`/`manualEnroll`/`revokeEnroll`/`restoreEnroll` (admin).
  - [admin.service.ts](src/services/admin.service.ts), [auth.service.ts](src/services/auth.service.ts).
- Course access helper: [src/lib/access.ts](src/lib/access.ts) — `getCourseAccess(courseId)` →
  `{ hasAccess, tier }`. **Access = active subscription OR active enrollment** (either grants it).
- Optional-user helper: [src/lib/current-user.ts](src/lib/current-user.ts) — `getOptionalUser()`
  (used by the public layout + home page for auth-aware CTAs).
- Case Bank (specialty grid): [src/app/(marketplace)/full-cases/](<src/app/(marketplace)/full-cases/>)
- Slug helpers: [src/lib/slug.ts](src/lib/slug.ts) — `/full-cases/[slug]` resolves the slug back to a
  real specialty by fetching `GET /cases/specialties` and slug-matching the name (robust; keep this).

### Route groups & layouts

- **`(marketplace)`** — member area. Layout [src/app/(marketplace)/layout.tsx](<src/app/(marketplace)/layout.tsx>)
  loads the user via `GET /auth/me`, redirects to `/login` if unauthenticated, renders `MarketplaceShell`
  (responsive sidebar drawer + `NamedHeader`). Pages: `dashboard`, `courses` (+ `courses/[id]` detail),
  **`my-courses`** (list of enrolled courses) + **`my-courses/[id]`** (content/lesson list) +
  **`my-courses/[id]/[lessonId]`** (in-app lesson viewer), `full-cases`, `subscriptions`, `settings`,
  and `payment/{success,cancel}` (Stripe return targets). **Owned course content lives under
  `/my-courses/[id]`, NOT `/courses/[id]/learn`** — `/courses/[id]` is the browse/buy page; you only
  reach `/my-courses/[id]` if you have access (else it redirects to `/courses/[id]`). Every marketplace
  route has a route-level `loading.tsx` skeleton (§6 Shared infra).
- **`(admin)`** — admin area. Layout [src/app/(admin)/layout.tsx](<src/app/(admin)/layout.tsx>) loads the
  user, redirects to `/login` if unauthenticated and to `/dashboard` if `role !== "admin"`, renders
  `AdminShell`. **Admin routes are flat `/admin-*`** (NOT nested under `/admin`): `admin-dashboard`,
  `admin-subscribers`, `admin-casebank` (+ `upload-casebank`), `admin-courses` (+ `upload-course`,
  + `admin-courses/[id]/content`), `admin-users`, `admin-enrollments`, `admin-settings`. The proxy
  matcher (§2) must include each.
- **Login role redirect**: [login/actions.ts](<src/app/(auth)/login/actions.ts>) sends `admin` →
  `/admin-dashboard`, everyone else → `/dashboard`. There is ONE shared login; no separate admin login.

### Admin case create/edit pipeline (built 2026-06-25)

- Multi-step form at [upload-casebank/](<src/app/(admin)/admin-casebank/upload-casebank/>) is now a real
  **React-Hook-Form + zod** form (FormProvider; `useFieldArray` for blood-test rows, management steps,
  resources). Schema + `CaseFormValues` + `emptyCaseValues`: [src/lib/schemas/case.ts](src/lib/schemas/case.ts).
- **`patientStory` round-trip**: the backend stores the whole patient narrative (story + social history,
  ideas, concerns, expectations, etc.) in ONE markdown field with bold headings. The form splits it into
  separate inputs. [src/lib/case-form.ts](src/lib/case-form.ts): `composePatientStory` (on save) ↔
  `parsePatientStory` (on load, **lossless** — unmatched prose falls into "Background Story"), plus
  `caseToFormValues` (prefill) and `buildCasePayload` (→ `CaseInput`).
- **Edit** = `/admin-casebank/upload-casebank?id=<caseId>` → page fetches `GET /cases/admin/:id`, prefills,
  hero says "Edit Case", submit → `PATCH /cases/:id`. **Create** (no id) → `POST /cases`. Both go through
  Server Action [upload-casebank/actions.ts](<src/app/(admin)/admin-casebank/upload-casebank/actions.ts>).
- Marking scheme: backend `[{heading, points[]}]` ↔ two textareas (one bullet per line); extra sections
  reflow into "Data Gathering". **Seen By** is an input; **isPublished** is set by the form's
  **Save as Draft** / **Publish Now** buttons. Still **no inputs** for `consultationType`/`difficulty` —
  on edit they're preserved (PATCH merge), on create the backend defaults apply.
- **Admin cases list = client-side over a fast parallel fetch-all.** `/cases/admin/all` does **NOT**
  support a publish-status filter — verified: `?isPublished=true|false` is **ignored** (returns all 251
  cases, mixed `isPublished`). Each item *does* carry `isPublished`, so Published/Draft is filtered
  **client-side**, which needs the whole set. [admin-casebank/page.tsx](<src/app/(admin)/admin-casebank/page.tsx>)
  calls `getAllAdminCases()` ([cases.service.ts](src/services/cases.service.ts)) which grabs page 1 then
  fetches the remaining pages **in parallel** (≈6 requests at limit 50, NOT 21 sequential — this was the
  original slowness). `AdminCases` then does **All/Published/Draft tabs (with live counts)** + specialty
  `<select>` (options derived from the fetched set, so draft-only specialties appear) + search (via
  `AdminListContext`) + `PAGE_SIZE=8` client pagination — all instant, no refetch. Top controls are
  **full-width stacked on mobile**, inline row on `sm+`. Rows show a **Draft** badge. (If the case count
  grows very large, ask backend to add a real `isPublished` filter + go server-side.)
- **Other admin lists (courses, users, subscribers, enrollments)** are also **client-side** over the
  fetched set, shared via [(admin)/_components/AdminListContext.tsx](<src/app/(admin)/_components/AdminListContext.tsx>)
  + `AdminSearchInput` + `Pagination`. Admin **courses** + **enrollments** course dropdown use
  `getAllAdminCourses()` ([courses.service.ts](src/services/courses.service.ts)) which pages through all
  `totalPages` (currently **sequential** — parallelize like `getAllAdminCases` if it gets slow).
  `getAdminUsers()` still fetches only page 1 (limit 50).
- Pagination number truncation is shared: [src/lib/pagination.ts](src/lib/pagination.ts) `pageNumbers`
  shows first + last + a window around the active page (≤15 numbers, `…` for gaps). Used by BOTH the
  admin `Pagination` and the user Case Bank pager.

### Shared infra

- Toasts: **sonner**. `<Toaster position="top-center" richColors />` is mounted in
  [src/app/layout.tsx](src/app/layout.tsx); call `toast(...)` anywhere (client).
- JWT helpers: [src/lib/jwt.ts](src/lib/jwt.ts) (Edge-safe `decodeJwt`/`isExpired`, used by the proxy).
- Password show/hide: shared `PasswordField` in [src/components/shared/AuthForm.tsx](src/components/shared/AuthForm.tsx).
- Cloudinary images whitelisted in [next.config.ts](next.config.ts) (`images.remotePatterns`).
- **No client state-management library.** The app is server-first (server components fetch via
  services; mutations use server actions + `router.refresh()`; auth is cookie-based). The old cart +
  `zustand` were removed — don't reintroduce a store unless a feature genuinely needs cross-route
  client state.
- **Loaders:** shared skeletons in [src/components/shared/Skeletons.tsx](src/components/shared/Skeletons.tsx)
  (`BannerSkeleton`, `CourseCardGridSkeleton`, `ListRowsSkeleton`, `YmalSkeleton`), composed by each
  marketplace `loading.tsx`. `YouMightAlsoLike` is also wrapped in its own `Suspense` so it streams.
- **Error boundaries:** shared [src/components/shared/ErrorState.tsx](src/components/shared/ErrorState.tsx)
  (retry card) is rendered by route-group `error.tsx` at [(marketplace)/error.tsx](<src/app/(marketplace)/error.tsx>)
  and [(admin)/error.tsx](<src/app/(admin)/error.tsx>) — these catch page errors **inside the shell** (sidebar
  stays), important because Render free-tier cold-starts/timeouts throw. The root [src/app/error.tsx](src/app/error.tsx)
  is the last-resort full-page fallback (public pages / catastrophic).
- **Scroll-to-top on pagination:** the admin client-side `Pagination` ([(admin)/_components/Pagination.tsx](<src/app/(admin)/_components/Pagination.tsx>))
  `window.scrollTo({top:0})` on page change (the list is sliced in memory, so nothing else scrolls the user up).
  The user Case Bank pager is `<Link>`-based, so Next handles scroll-to-top on navigation.
- **Sticky case-detail tabs:** the section tab bar (Full Case/Patient/Doctor/Examiner/Resources) in
  [MockCasesNavState.tsx](<src/app/(marketplace)/full-cases/[cases]/[id]/_components/MockCasesNavState.tsx>)
  is `sticky top-0` so it stays reachable through long case content.
- **Case header color is fixed:** `MockHeaderBg` always uses the app default `#2D135C` (the old
  per-seed `colorFromSeed` logic + `GetRandomColor.tsx` were removed).
- **Back to top:** [src/components/shared/BackToTop.tsx](src/components/shared/BackToTop.tsx) (floating
  button, appears after 400px scroll) is mounted once in `MarketplaceShell`, `AdminShell`, and the
  public layout — so it covers every page in all three areas.
- **Search clear (✕):** `SearchBanner`, admin `AdminSearchInput`, and the user Case Bank search
  (`CasesListClient`) each show a ✕ to reset the query when non-empty.
- **Branded 404:** [src/app/not-found.tsx](src/app/not-found.tsx) (global) — replaces the default 404.
- **Case prev/next:** [CaseNav.tsx](<src/app/(marketplace)/full-cases/[cases]/[id]/_components/CaseNav.tsx>)
  (streamed via `Suspense`) shows Previous/Next station within the browsing context (specialty, or
  "all"). Neighbours are found in a 50-item window (backend `limit` cap); a neighbour outside the window
  (e.g. a high station in the full 251-case "all" list) just hides its button — never a broken link.
  Full coverage across a large "all" list would need a backend "adjacent case" endpoint.
- **Protected PDF viewer:** [src/components/shared/PdfViewer.tsx](src/components/shared/PdfViewer.tsx)
  (`react-pdf`/pdf.js, canvas render, no text layer / no download / right-click disabled) points at the
  **access-checked proxy** [src/app/api/courses/[id]/content/[lessonId]/route.ts](<src/app/api/courses/[id]/content/[lessonId]/route.ts>),
  which verifies course access + tier and streams the file so the real (private) Cloudinary URL is never
  exposed. **Only PDFs render in-app.** Video lessons are opened as **external Google-Drive links** from
  the lesson list (pdf_drive tier only) — not viewed in-app. (Paying for a course also adds the user to a
  private Google Drive, handled by the backend; the lesson list still handles a Drive link if one is
  returned so nothing is dropped.)
- **Settings form:** shared [src/components/shared/SettingsForm.tsx](src/components/shared/SettingsForm.tsx)
  takes its server actions as an `actions` prop — used by BOTH `admin-settings` and member `settings`
  (`PATCH /auth/me`, `change-password`, `logout-all`).
- **`YouMightAlsoLike` + `ProductsCard`** are self-fetching server components over `getCourses` (public);
  `ProductsCard` sorts newest-first and honors a `cutBy` limit. Cards link to `/products/[id]` (public)
  or `/courses/[id]` (member).

## 7. Current state / plan

### Subscription vs. Enrollment (mental model — they are different things)

- **Subscription** = a recurring **Stripe billing** relationship. Two kinds: **Case Bank** (unlocks ALL
  cases) and **course** (per course; `tier` = `pdf_only`|`pdf_drive`, `interval` monthly/quarterly).
  Status via `/subscriptions/{me, case-bank/status, course/:id/status}`.
- **Enrollment** = an **access record for ONE course**, created by a payment OR an admin manual grant
  (`source: "manual"`, `paymentId` all-zeros). Carries `accessTier`, `isActive`. Course-only.
- **Course access = active subscription OR active enrollment** — [lib/access.ts](src/lib/access.ts).
  (Case Bank access = its subscription only.) One-liner: **subscription = paying; enrollment = access**;
  access can exist without paying (admin grant).

### Integrated & working (live backend)

- **Auth** — login/register/logout, role redirect, proactive refresh + rotation in the proxy,
  **return-to-page-after-login** (`?redirect=` + `safeRedirect`, see §2).
- **Cases** — user read flow (list → specialty → detail). **Case Bank access is enforced by the
  BACKEND**, not a frontend paywall: `GET /cases` returns the **5 free cases** to unsubscribed users (or
  **all** to subscribers), and `GET /cases/:id` only returns viewable cases. So the case detail has **no
  paywall** — any case that loads is fully viewable. The Case Bank **list** shows a **subscribe upsell
  banner** to unsubscribed users ([full-cases/_components/CaseBankUpsell.tsx](<src/app/(marketplace)/full-cases/_components/CaseBankUpsell.tsx>)
  → `POST /payments/checkout` `type:"case_bank"`, action in [full-cases/actions.ts](<src/app/(marketplace)/full-cases/actions.ts>)).
- **Courses (member)** — list (`/courses`), detail (`/courses/[id]`) with access gating + a
  tier×interval **plan picker** → course checkout; **My Courses** (`/my-courses`, from `/enrollments/me`)
  + content list + in-app lesson viewer under `/my-courses/[id]`.
- **Settings** (member + admin) — profile / password / logout-all (shared form).
- **My Subscriptions** (`/subscriptions`, from `/subscriptions/me`) — real cards (case_bank + course,
  status/tier/interval/renewal date) + a **Manage billing** button (`POST /payments/billing-portal`).
- **Dashboard** — real stat counts + My Courses section + Subscriptions section.
- **Banner searches** work via the shared client [SearchBanner](src/components/shared/SearchBanner.tsx)
  (Courses + Subscriptions filter client-side; Case Bank grid + case list already had working search).
- **Public site** — home/products connected to real courses; auth-aware CTAs.
- **Admin** — dashboard, casebank (list + create/edit/publish/duplicate/delete/images), courses (list via
  `/courses/admin/all` + create/edit/publish/delete/thumbnail + Course Content), subscribers, users,
  enrollments (manual/revoke/restore).

### ⚠️ Blocked on backend (frontend built + correct; fails at the backend)

1. **Stripe checkout** (course + Case Bank) — `/payments/plans` returns dummy price IDs
   (`price_dummy_*`), so `POST /payments/checkout` 500s. Needs real Stripe prices; then verify the
   checkout **response shape** (the redirect-URL field is still unknown — the action tries
   `url`/`checkoutUrl`/`sessionUrl`).
2. **Course PDF display** — lesson `fileUrl`s are **private Cloudinary** assets (401), so the proxy
   can't stream them. Needs a signed URL or a backend stream endpoint; then point the proxy at it.

### Remaining mock (no backend endpoint exists)

- Live-class **Countdown** (`CountDownToClass`) — commented out on the public pages; admin "Schedule
  Live Class" is a stub. No classes/calendar endpoint.

### Next candidates

- When Stripe is fixed: verify checkout end-to-end, then build the real **My Subscriptions** cards +
  billing-portal button (probe `/subscriptions/me` item shape first).

---

## 8. Verified response shapes — non-Cases modules

All wrapped in the standard envelope (`{ success, message, data }`). Verified 2026-07-10.

**Course** (`GET /courses` = plain array, published-only; `GET /courses/:id` = single, auth):

```ts
{ _id, title, description, price, thumbnailUrl?, isPublished, createdBy, createdAt, updatedAt }
```

Detail returns **no embedded lessons** — fetch content separately. `price` is effectively unused for
checkout (pricing is global by tier — see plans below).

**Course Content** (`GET /courses/:courseId/content` = plain array):

```ts
{ _id, courseId, title, type: "pdf"|"video", fileUrl, order, createdAt, updatedAt }
```

PDF `fileUrl` = a **private** Cloudinary raw URL (needs signing — §7). Video `fileUrl` = a Google-Drive
share link (embed its `/preview` form).

**Payments plans** (`GET /payments/plans` = array of plan groups):

```ts
{ type: "case_bank"|"course", tier?: "pdf_only"|"pdf_drive", name, description,
  prices: [{ amount /* pence */, currency, interval, stripePriceId, label /* "£69.99 / month" */ }] }
```

`case_bank` = one monthly price (£24.99). `course` tiers = monthly + quarterly. `amount` is minor units —
prefer the preformatted `label`. **Pricing is GLOBAL by tier**, keyed to `stripePriceId`, NOT `Course.price`.

**Subscription / enrollment status:**

```ts
GET /subscriptions/course/:courseId/status  → { active: boolean }
GET /subscriptions/case-bank/status         → { active: boolean }
GET /enrollments/check/:courseId            → { enrolled: boolean, accessTier?: "pdf_only"|"pdf_drive", accessGrantedAt? }
```

**Subscriptions** (`GET /subscriptions/me` = plain array; `courseId` populated + `tier` only for
`type: "course"`):

```ts
{ _id, type: "case_bank"|"course", userId,
  courseId?: { _id, title, thumbnailUrl? }, tier?: "pdf_only"|"pdf_drive",
  billingInterval /* "monthly"|"quarterly" */, status /* "active"|… */, cancelAtPeriodEnd,
  currentPeriodStart, currentPeriodEnd, stripeCustomerId, stripeSubscriptionId, createdAt, updatedAt }
```

**Enrollments** (`GET /enrollments/me` = plain array; `courseId` **populated**):

```ts
{ _id, courseId: { _id, title, description, price, thumbnailUrl? }, userId, accessTier,
  isActive, source: "manual"|"payment", grantedBy, paymentId, accessGrantedAt, createdAt, updatedAt }
```
