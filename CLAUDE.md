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
- The backend has these modules (verified 2026-06-20). Only **Cases (read)** + **auth login/register**
  are integrated in the frontend so far; everything else exists on the backend but is NOT yet wired.

| Module | Key endpoints | Auth | Notes |
|---|---|---|---|
| Health | `GET /health` | none | |
| Auth | `POST /auth/{register,login,refresh-token,logout,forgot-password,reset-password,change-password,logout-all}`, `GET/PATCH /auth/me` | mixed | register/login/refresh/forgot/reset are public; me/change-password/logout-all need token |
| Auth admin | `POST/GET /auth/admin/users`, `GET/PATCH /auth/admin/users/:userId`, `PATCH /auth/admin/users/:userId/toggle-status` | admin | user management (note: also duplicated under `/admin/users`) |
| Courses | `GET /courses` (PUBLIC, returns `data: []` plain array — NOT paginated), `GET /courses/:id` (auth), `POST/PATCH/DELETE /courses/:id` (admin), `PATCH /courses/:id/{thumbnail,publish}` (admin) | mixed | `POST` body: `{ title, description, price }`. thumbnail = multipart field `thumbnail`. |
| Course Content | `GET /courses/:courseId/content[/:id]` (auth), `POST` (admin, multipart: `file,title,type,order,duration`), `PATCH/DELETE .../content/:id` (admin) | mixed | lesson `type` e.g. `"video"` |
| Cases | see §4 | mixed | only module with a written integration doc + frontend integration |
| Enrollments | `GET /enrollments/me` (auth, `data: []` array), `GET /enrollments/check/:courseId` (auth), `GET /enrollments` + `/course/:courseId` + `/user/:userId` (admin), `POST /enrollments/{manual,revoke}` (admin, `{ userId, courseId }`), `PATCH /enrollments/:id/restore` (admin) | mixed | course access grants; likely backs "Subscriptions"/"My Courses" |
| Admin | `GET /admin/dashboard`, `GET /admin/users[/:userId]`, `PATCH /admin/users/:userId/toggle-status` | admin | dashboard stats + user mgmt |

- Frontend pages currently **static / not connected**: Courses, Subscriptions, Dashboard, Settings.
  Backend endpoints DO exist for Courses (Courses + Course Content + Enrollments) and Dashboard
  (`/admin/dashboard`) — so these are integratable now; they were just absent from the Cases doc.
- No per-module response-schema doc exists yet for Courses/Enrollments/Admin. As of 2026-06-20 the
  Courses and Enrollments collections are empty in prod (`data: []`), so item shapes can't be inferred
  from live data — ask backend for a Courses doc or a sample record before building those UIs.

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
  and redirects to `/login`. The axios interceptor remains a fallback for 401s during an in-render
  API call. **The matcher must list every protected route** (marketplace + admin).
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

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation / bad request (see `errors[]`) |
| 401 | No/expired token → refresh then retry, else redirect to login |
| 403 | Authenticated but not admin |
| 404 | Not found |
| 413 | Image > 5 MB |
| 429 | Rate limit (200 req / 15 min on cases endpoints) |
| 500 | Server error |

Validation `errors` shape: `[{ field: "patientData.age", message: "..." }]` (array of field/message).

---

## 4. Cases module — backend contract

Base: `/api/v1/cases`. Two visibility states:
- **Draft** (`isPublished: false`) — admins only.
- **Published** (`isPublished: true`) — all authenticated users.

> IMPORTANT: `GET /cases` and `GET /cases/specialties` return **only published** cases. If the DB has
> no published cases, the user-facing Case Bank is correctly empty. Admins create via `POST /cases`
> then publish via `PATCH /cases/:id/publish`. To see drafts use the admin routes.

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

| Method & path | Auth | Notes |
|---|---|---|
| `GET /cases/specialties` | user | Published-only specialties + counts: `[{ specialty, count }]`. Build the filter from this. |
| `GET /cases` | user | Paginated published list. Params: `page, limit, specialty, difficulty, search`. |
| `GET /cases/specialty/:specialty` | user | Same as `?specialty=` but path param (URL-encode it). |
| `GET /cases/:id` | user | Full published case. 404 if not found or not published. |
| `GET /cases/admin/all` | admin | All cases incl. drafts; `createdBy` populated. |
| `GET /cases/admin/:id` | admin | Full case incl. drafts; `createdBy` populated. |
| `POST /cases` | admin | Create (draft unless `isPublished:true`). JSON or multipart — see below. |
| `PATCH /cases/:id` | admin | Partial update. **Arrays replace, not merge** (see notes). |
| `PATCH /cases/:id/image` | admin | Multipart field `image`. Replaces cover; resized 800×450. Returns `{ imageUrl }`. |
| `PATCH /cases/:id/station-image` | admin | Multipart field `stationImage`. Resized 800×600. Returns `{ stationImageUrl }`. |
| `PATCH /cases/:id/publish` | admin | Toggle publish; no body. Returns `{ _id, title, isPublished }`. |
| `POST /cases/:id/duplicate` | admin | Draft copy: `"Copy of …"`, next stationNumber, no images, `isPublished:false`. |
| `DELETE /cases/:id` | admin | Hard delete (+ Cloudinary images). `data: null`. |

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
fd.append("image", coverFile);          // optional
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

- Types: [src/types/api.ts](src/types/api.ts)
- Cases service: [src/services/cases.service.ts](src/services/cases.service.ts) (user reads only so far)
- Auth service: [src/services/auth.service.ts](src/services/auth.service.ts)
- Case Bank (specialty grid): [src/app/(marketplace)/full-cases/](src/app/(marketplace)/full-cases/)
- Slug helpers: [src/lib/slug.ts](src/lib/slug.ts) — `/full-cases/[slug]` resolves the slug back to a
  real specialty by fetching `GET /cases/specialties` and slug-matching the name (robust; keep this).

### Route groups & layouts
- **`(marketplace)`** — member area. Layout [src/app/(marketplace)/layout.tsx](src/app/(marketplace)/layout.tsx)
  loads the user via `GET /auth/me`, redirects to `/login` if unauthenticated, renders `MarketplaceShell`
  (responsive sidebar drawer + `NamedHeader`). Pages: `dashboard`, `courses`, `full-cases`,
  `subscriptions`, `settings`.
- **`(admin)`** — admin area. Layout [src/app/(admin)/layout.tsx](src/app/(admin)/layout.tsx) loads the
  user, redirects to `/login` if unauthenticated and to `/dashboard` if `role !== "admin"`, renders
  `AdminShell`. **Admin routes are flat `/admin-*`** (NOT nested under `/admin`): `admin-dashboard`,
  `admin-subscribers`, `admin-casebank` (+ `upload-casebank`), `admin-courses` (+ `upload-course`),
  `admin-settings`. The proxy matcher (§2) must include each.
- **Login role redirect**: [login/actions.ts](src/app/(auth)/login/actions.ts) sends `admin` →
  `/admin-dashboard`, everyone else → `/dashboard`. There is ONE shared login; no separate admin login.

### Shared infra
- Toasts: **sonner**. `<Toaster position="top-center" richColors />` is mounted in
  [src/app/layout.tsx](src/app/layout.tsx); call `toast(...)` anywhere (client).
- JWT helpers: [src/lib/jwt.ts](src/lib/jwt.ts) (Edge-safe `decodeJwt`/`isExpired`, used by the proxy).
- Password show/hide: shared `PasswordField` in [src/components/shared/AuthForm.tsx](src/components/shared/AuthForm.tsx).
- Cloudinary images whitelisted in [next.config.ts](next.config.ts) (`images.remotePatterns`).

## 7. Discrepancies reconciled with backend doc (fixed 2026-06-20)

All five type/data mismatches are now fixed (typecheck clean):

1. ✅ `Gender` now `"male"|"female"|"other"`. ([src/types/api.ts](src/types/api.ts))
2. ✅ `Case` (list type) now has `imageUrl?`. (UI wiring of the cover image into list cards is still TODO.)
3. ✅ `CaseDetail` now has `imageUrl?`, `stationImageUrl?`, `createdBy: string | UserRef`.
   (UI wiring of detail images is still TODO.)
4. ✅ `RecentConsultation` now has `date?` and `role?`; `adaptCase` uses the real date
   (formatted) and appends `role` to the consulter. ([adaptCase.ts](src/app/(marketplace)/full-cases/[cases]/[id]/_components/adaptCase.ts))
5. ✅ `SPECIALTY_IMAGES` is now keyed by the exact backend specialty strings (lowercased), so all 12
   specialties resolve to an image. ([src/app/(marketplace)/full-cases/_components/MockBankCards.tsx](src/app/(marketplace)/full-cases/_components/MockBankCards.tsx))

Remaining TODO (not a discrepancy, an enhancement):
- ✅ Detail page now renders `stationImageUrl` + `imageUrl` (when present) below Patient Data,
  inside `PatientDataSection` (shared by the "Doctor" and "Full Case" tabs). Cloudinary host is
  whitelisted in [next.config.ts](next.config.ts) (`images.remotePatterns` → `res.cloudinary.com`).
  Restart `next dev` after editing next.config for image config to take effect.
- TODO: render `imageUrl` on the case **list** cards.

Note: as of 2026-06-20 none of the published cases actually carry images yet (verified via live API),
so the new image block is invisible until a case is created/updated with an image via the admin flow.

## 8. Current state / plan

**Integrated (wired to live backend):**
- User-facing case read flow (list → specialty → detail) — matches the backend.
- Auth: login/register/logout, role-based redirect, and proactive token refresh + rotation in the proxy.

**Built but UI-only / mock data (NOT yet wired to the backend):**
- **Admin UI** scaffolding — all pages exist with the designed layouts and mock data:
  dashboard (stats + creation buttons + recent subscribers), subscribers table (tabs/search),
  casebank list (+ `Add Case` → multi-step upload form), courses grid (+ upload-course form).
- **Marketplace dashboard** — welcome + stat cards + subscriptions/courses variant cards +
  GoPremium/Calendar/UpcomingClasses (all mock).
- **Upload forms**: course upload ([UploadCourseForm](src/app/(admin)/admin-courses/upload-course/_components/UploadCourseForm.tsx))
  and the 4-step case upload ([upload-casebank/_components/](src/app/(admin)/admin-casebank/upload-casebank/_components/));
  inputs carry backend-aligned `name`s but no submit handler yet.
- Admin "Schedule Live Class" / "Create Video" buttons are stubs (toast "Coming soon" / placeholder).

**Next:**
- Add admin **write services** to [src/services/cases.service.ts](src/services/cases.service.ts)
  (none exist yet) and wire the case upload form → `POST /cases` (+ image multipart), publish,
  duplicate, delete, edit. NOTE: the case form's step-2 has extra fields (Social History, Idea,
  Concern, etc.) the backend model doesn't have — decide whether to compose into `patientStory` or
  request backend fields.
- Wire **Courses / Enrollments / Admin dashboard** once response schemas are available (see §0; those
  collections are empty in prod so shapes can't be inferred from live data yet).
- Needs an **admin account** (`role: "admin"`) to actually test the admin area end-to-end.
