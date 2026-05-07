# Native-Med — Project Context

## What this project is

Native-Med is an online medical education platform for UK medical professionals preparing for the **MRCGP SCA exam**. It's a B2C SaaS product with three areas:

- **Public marketing site** — home, about, contact, products listing
- **Auth** — login, register, password reset
- **Marketplace** (authenticated) — dashboard, courses, full-cases (mock exam cases), subscriptions, settings

Branding: purple primary `#5925B3` + navy secondary `#1C3967`, Fustat font.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict, target ES2017 — see "Gotchas")
- **Tailwind CSS v4** with custom theme tokens in [src/app/globals.css](src/app/globals.css)
- **shadcn/ui** (Radix Nova style, neutral base) — currently only Button is installed
- **lucide-react** + **react-icons** for icons
- **axios** — HTTP client with interceptors
- **react-hook-form** + **zod** + **@hookform/resolvers** — forms & validation
- Path alias: `@/*` → `./src/*`

## Project structure

```
.
├── proxy.ts                proactive auth refresh + route gate (Next.js 16, was middleware.ts)
├── .env.local              API_URL=https://nativemed.onrender.com (gitignored)
└── src/
    ├── app/
    │   ├── (public)/       marketing site, layout fetches user for header
    │   ├── (auth)/         login, register, each with actions.ts
    │   └── (marketplace)/  dashboard, courses, full-cases, subscriptions, settings
    │       ├── layout.tsx                Server Component, calls /me, redirects on 401
    │       ├── actions.ts                logout Server Action
    │       ├── _components/MarketplaceShell.tsx   client shell with sidebar state
    │       └── full-cases/
    │           ├── page.tsx                       Server Component → specialty grid
    │           ├── _components/MockBankCards.tsx  "All Cases" card + per-specialty cards
    │           ├── [cases]/
    │           │   ├── page.tsx                   Server Component → paginated case list
    │           │   └── _components/
    │           │       ├── DifferentMockCases.tsx Renders Case[] rows
    │           │       └── Pagination.tsx         Prev/Next + numbered page links
    │           └── [cases]/[id]/
    │               ├── page.tsx                   Server Component → case detail + badges
    │               └── _components/
    │                   ├── adaptCase.ts           API → mock-shape adapter + parsers
    │                   ├── MockCasesNavState.tsx  Tab switcher (Full/Patient/Doctor/Examiner/Resources)
    │                   ├── FullCase.tsx Patient.tsx Doctor.tsx Examiner.tsx Resources.tsx
    │                   └── (other render helpers)
    ├── components/
    │   ├── shared/         Header, NamedHeader, Footer, AuthForm (RHF+Zod), etc.
    │   └── ui/             shadcn primitives (Button only)
    ├── lib/
    │   ├── utils.ts        cn helper
    │   ├── api.ts          axios instance + interceptors
    │   ├── session.ts      cookie helpers (httpOnly accessToken/refreshToken)
    │   ├── jwt.ts          decode JWT exp (base64, no signature verify, Edge-safe)
    │   ├── slug.ts         slugify() + findBySlug() — used for specialty URLs
    │   └── schemas/auth.ts Zod schemas: loginSchema, registerSchema
    ├── services/
    │   ├── auth.service.ts        login, register, refresh, logout, me
    │   └── cases.service.ts       getSpecialties, getAllCases, getCasesBySpecialty, getCase
    ├── types/
    │   ├── api.ts          ApiResponse<T>, User, AuthTokens, Specialty, Case, CasesPage,
    │   │                   CaseDetail, BloodTestRow (with isAbnormal), MarkingSchemeSection,
    │   │                   FurtherResource, FormActionResult, JwtPayload
    │   └── MockCasesPresentationInterface.tsx   tab-component data shape (what the UI consumes)
    └── hooks/              empty, for future custom hooks
```

`proxy.ts` lives at the **project root** (next to `package.json`), not inside `src/`. Next.js 16 supports either location; we keep it at root.

**Convention**: route-group-specific components live in `_components/` folders inside the route group. Cross-cutting components live in `src/components/shared/`.

## Backend API

The backend is at **`https://nativemed.onrender.com`** (Render free tier — first request after idle can take 30–60s to wake up). Local dev backend was `http://localhost:5000`. Base URL is `process.env.API_URL` (server-only, no `NEXT_PUBLIC_` prefix). API is versioned at `/api/v1/...`.

Postman collection at root (`NativeMed.postman_collection.json` + `NativeMed.postman_environment.json`) has been imported and exercised. Below are **confirmed** shapes from real responses.

### Response envelope (universal)

```ts
type ApiResponse<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Record<string, string[]> }
```

### Status code map

| Scenario | Status | Body |
|---|---|---|
| Success | `200` / `201` | `{ success: true, message, data }` |
| Auth failure (missing/expired/invalid token, wrong credentials) | `401` | `{ success: false, message }` |
| Validation failure (Zod) | `422` | `{ success: false, message: "Validation failed", errors: { field: [msgs] } }` |
| Server crash / unhandled error | `500` | `{ success: false, message: "Something went wrong" }` |

### Auth (`/api/v1/auth`)

**Login / Register response** (identical shape — register auto-logs in):
```ts
{
  success: true,
  message: "Login successful" | "Registration successful",
  data: {
    accessToken: string,    // JWT (HS256)
    refreshToken: string,   // opaque hex string (NOT a JWT)
    user: {
      _id: string,
      fullName: string,
      email: string,
      role: "user" | "admin",
      phone: string,
      mustChangePassword: boolean,
    }
  }
}
```

**`GET /me` response** — `data` IS the user (no extra `user` nesting). Adds `isActive`, `createdAt`, `updatedAt`:
```ts
{
  success: true,
  message: "Profile fetched",
  data: {
    _id, fullName, email, phone, role,
    isActive: boolean,
    mustChangePassword: boolean,
    createdAt: string,   // ISO
    updatedAt: string,
  }
}
```

**`POST /refresh-token` response** — both tokens rotate (old refresh token is invalidated):
```ts
{ success: true, message: "Token refreshed", data: { accessToken, refreshToken } }
```

### JWT facts

- Access token JWT payload: `{ _id, email, role, iat, exp }`
- **Access token TTL: 15 minutes** (`exp - iat = 900`)
- Refresh token is **opaque** (not a JWT) — backend looks it up
- **Refresh token TTL: pending — backend dev hasn't confirmed**
- **Refresh token rotation: enabled** — every refresh issues NEW access AND new refresh; old refresh becomes invalid

### Cases (`/api/v1/cases`)

**`GET /cases/specialties`** ✅ — used by `/full-cases` page:
```ts
{
  success: true,
  message: "Specialties fetched",
  data: Array<{ specialty: string; count: number }>
}
```
16 specialties currently (Cardiology, Dermatology, ENT & Eye, Endocrinology, Ethics, Gastroenterology, General Practice, Genetics, Gynaecology, Infectious Disease, Men's Health, Mental Health, Neurology, Paediatrics, Respiratory, Rheumatology). Counts vary (1–41). **The API returns counts** — adapter uses them directly.

**`GET /cases?page=1&limit=12`** ✅ — paginated list of all cases. Used by `/full-cases/all`:
```ts
{
  success: true,
  message: "Cases fetched",
  data: {
    items: Case[],
    total: number,    // currently 239
    page: number,
    limit: number,
    totalPages: number,
  }
}
```

**`GET /cases/specialty/:specialtyName`** ✅ — paginated list filtered by specialty. Used by `/full-cases/<slug>`:
- Path segment is the **literal specialty name** (URL-encoded), not slug. Adapter does `encodeURIComponent`.
- Same pagination shape as `/cases`.
- Earlier we tried `?specialty=Cardiology` (didn't work) — the correct pattern is the path segment.

**`GET /cases/:id`** ✅ — single case detail. Used by `/full-cases/<slug>/<id>`:
```ts
{
  success: true,
  message: "Case fetched",
  data: CaseDetail   // see types/api.ts — extends Case with rich fields
}
```

#### Case shape (list view)
```ts
{
  _id, stationNumber, title, specialty,
  difficulty: "easy" | "medium" | "hard",   // "medium" is the only value seen so far
  patientData: { name, age, gender: "male" | "female" },
  createdAt
}
```

#### CaseDetail shape (extends Case)
```ts
{
  ...Case,
  consultationType: string,   // e.g. "Video Consultation", "Telephone Consultation"
  isPublished: boolean,
  patientStory: string,       // long freeform role-player script (see "patientStory parser")
  exampleExplanation: string, // long ideal-doctor speech
  learningPoints: string,     // long study notes
  management: string[],       // numbered action plan; one item is a "Safety net:" prefix (extracted)
  markingScheme: Array<{ heading: string; points: string[] }>,
  furtherResources: Array<{ title: string; url: string }>,
  patientData: {
    name, age, gender,
    pastMedicalHistory: string[],
    drugHistory: string[],   // mixed: meds + "Allergic to X" + "No known drug allergy" + "Not on any current medication"
    recentConsultation: { seenBy: string; notes: string },  // freeform text blobs
    bloodTestResults: {
      summary: string,
      rows: Array<{ test, result, referenceRange, isAbnormal?: boolean }>,  // [] when not relevant
    },
  },
  updatedAt
}
```

#### Case data quirks (learned from sampling 4 cases)
- **`consultationType`** values seen so far: `"Video Consultation"`, `"Telephone Consultation"`. Probably `"Face-to-Face"` exists too.
- **`difficulty`** is `"medium"` for every case sampled. Easy/hard not yet observed.
- **Paediatric cases**: the role-player is the parent — `patientData.name/age/gender` reflects the child being treated, but `patientStory` opens "You are [parent name], the mother of [child]…". Paediatric stories also have a labeled `PBIND:` block (Pregnancy, Birth, Immunisation, Nutrition, Development).
- **`bloodTestResults.rows`** carries an undocumented `isAbnormal: boolean` flag — surfaced via [Doctor.tsx](src/app/(marketplace)/full-cases/[cases]/[id]/_components/Doctor.tsx) which renders the Result column **red + bold + ⚠** when `isAbnormal: true`.
- **Safety-net advice** lives **inside the `management` array**, not as a top-level field. Three phrasings observed: `"Safety net:"`, `"Safety netting advice:"`, `"Provide clear safety-netting advice:"`. The adapter's `extractSafetyNet()` uses a flexible `/safety[-\s]?net/i` match to find the item, strips the prefix at the first colon, and removes it from `management` so it isn't shown twice.
- **`patientStory` is a single freeform string** but contains consistent labeled sections that the adapter parses into the mock fields the UI expects (see "Patient story parser" below).

### `mustChangePassword` flag

- Likely flips to `true` for admin-created users (`POST /auth/admin/users`)
- Auth flow should check this and force password change before granting full access (currently NOT implemented — just redirects to /dashboard regardless)

### Confirmed product/business decisions

- **Courses == products** in the data model. `/products` and `/courses` pages both render data from the courses endpoint (when wired).
- **Roles**: `"user"` and `"admin"` (lowercase). `role` is in BOTH the JWT and `/me` response — middleware can decode JWT directly without a `/me` call.
- **Backend uses Zod for validation** (error message "Invalid input: expected string, received undefined" is Zod default) — frontend Zod schemas can mirror backend constraints.

### Endpoints NOT yet in the API (waiting on backend)

- **Cart** — endpoint coming, shape TBD
- **Subscriptions / payments / checkout** — Stripe + PayPal mentioned in UI, no endpoints yet
- **Newsletter signup** (footer)
- **Contact form** (`/contact` page)
- **Course progress tracking** (cards show "% complete" but no endpoint)
- **Mock case attempt tracking**
- **Search** (marketplace search bars — currently decorative)
- **Email verification** on register
- **Testimonials, FAQ, founder bio** — currently static, may stay static

### Pending questions for backend dev

- **Refresh token TTL** — drives `REFRESH_TOKEN_MAX_AGE` in [src/lib/session.ts](src/lib/session.ts) (currently placeholder = 7 days)

## Architecture decisions for API integration

### Server-side fetching (idiomatic Next.js App Router)

- Server Components fetch data via service functions, pass to Client Components as props
- No proxy route handlers for read-only data — we are NOT doing a full BFF
- The Next.js server is effectively the BFF — tokens stay server-side, never touch the browser

### HTTP client: axios with interceptors ([src/lib/api.ts](src/lib/api.ts))

- `baseURL` = `${process.env.API_URL}/api/v1`
- **Request interceptor**: if config.headers has no `Authorization` already, reads `accessToken` cookie via `getAccessToken()` and attaches `Authorization: Bearer <token>`. The "if already set" check is required because the response interceptor manually sets the header during retry, and we don't want the request interceptor to overwrite it with a stale cookie value.
- **Response interceptor**:
  ```
  On 401:
    if URL is /auth/login | /auth/register | /auth/refresh-token
      → don't refresh, surface error to caller
    else if not already retried
      → call /auth/refresh-token via bare `axios.post` (bypasses our interceptors)
      → on success: try setSession() (may throw in Server Component context — caught silently),
                    set Authorization header on original config, retry once via api(original)
      → on failure: try clearSession() (caught silently), reject the original error
  ```
- Refresh requests are deduplicated via `refreshInFlight` promise so concurrent 401s don't hammer the refresh endpoint.

**Note**: axios loses Next.js's built-in `fetch()` cache. Acceptable trade-off — auth-gated routes shouldn't be cached anyway.

### Session helpers ([src/lib/session.ts](src/lib/session.ts))

- `getAccessToken()`, `getRefreshToken()`, `setSession({accessToken, refreshToken})`, `clearSession()`
- All async (Next 16's `cookies()` is async)
- Cookie options: `httpOnly: true`, `secure: production-only`, `sameSite: 'lax'`, `path: '/'`
- `accessToken` cookie max-age: **15 min** (matches JWT TTL)
- `refreshToken` cookie max-age: **7 days** placeholder (`REFRESH_TOKEN_MAX_AGE`) — update when backend confirms TTL
- `setSession` / `clearSession` will throw in Server Component contexts (only Server Actions, Route Handlers, and Middleware can write cookies). Callers wrap in try/catch where needed.

### Auth flow

- **Login/Register**: form (RHF + Zod) → Server Action → `auth.service.{login|register}()` → backend returns tokens → `setSession({accessToken, refreshToken})` → `redirect('/dashboard')`
- Login Server Action at [src/app/(auth)/login/actions.ts](src/app/(auth)/login/actions.ts), register at [src/app/(auth)/register/actions.ts](src/app/(auth)/register/actions.ts)
- Both handle Zod validation, axios errors (extracts `response.data.message` and `response.data.errors`), surfaces them as `FormActionResult` for inline form display
- `mustChangePassword` not yet handled — TODO when change-password page exists
- **Logout**: [src/app/(marketplace)/actions.ts](src/app/(marketplace)/actions.ts) `logoutAction()` — calls backend `/auth/logout`, clears cookies, redirects to `/login`. Wired to SideNav "Log Out" via `<form action={logoutAction}>` in [SideNavLinks.tsx](src/app/(marketplace)/_components/SideNavLinks.tsx)

### Two-layer auth gate for `(marketplace)` — Strategy B (proactive)

1. **Proxy/Middleware** ([proxy.ts](proxy.ts) at project root, exports `proxy` not `middleware`):
   - Matcher gates `/dashboard`, `/courses`, `/full-cases`, `/subscriptions`, `/settings` (and subpaths)
   - Reads `accessToken` cookie. Decodes JWT exp via `decodeJwt()` from [src/lib/jwt.ts](src/lib/jwt.ts) (no signature verify — Edge-safe)
   - If access token still valid (with 30s leeway) → `NextResponse.next()`
   - If expired/missing AND refresh token exists → calls `/auth/refresh-token` via bare `fetch` (Edge-compatible). On success: updates BOTH `request.cookies` (so the Server Component sees the new token in this request) AND `response.cookies` (so the browser receives them). On failure: clears cookies, redirects to `/login`
   - If no refresh token at all → redirect to `/login`

2. **Marketplace layout** ([src/app/(marketplace)/layout.tsx](src/app/(marketplace)/layout.tsx)):
   - Server Component. Calls `auth.service.me()` via `loadUser()` (try/catch — returns null on 401)
   - If user is null → `redirect('/login')` (rare, since middleware handles refresh)
   - Otherwise renders `<MarketplaceShell user={user}>` (a Client Component for sidebar state) with children

Real auth enforcement happens at the backend on every API call. The proxy + layout do proactive UX-smoothing.

**Future**: admin-only routes go in a separate `(admin)` route group with its own layout that checks `user.role === 'admin'`.

### Public layout user fetch ([src/app/(public)/layout.tsx](src/app/(public)/layout.tsx))

- Server Component. Calls `getAccessToken()` first; if no token, skips the `/me` call entirely (passes `null` to header). Otherwise calls `me()` and gracefully falls back to `null` on any error.
- Passes user to `<PublicHeader user={user}>`. When logged-in, header renders `<NamedHeader user={user}>` (cart, avatar, name) instead of "Get Started" button.
- Side effect: all `(public)` routes are now `dynamic` (read cookies). Static caching is lost. If perf becomes an issue, isolate the user fetch in a `<Suspense>`-bounded inner component so the marketing shell stays static.

### Form UX ([src/components/shared/AuthForm.tsx](src/components/shared/AuthForm.tsx))

- Single file with `LoginForm` + `RegisterForm` sub-components, each with its own RHF instance + schema
- `AuthForm({ mode })` dispatches between them — the page-level API is unchanged
- Submit buttons show `<Loader2 className="size-4 animate-spin" />` + "Signing In..." / "Creating Account..." while pending
- Server-side errors map to RHF field errors via `applyServerErrors()` helper; submit-level errors render in a red `role="alert"` paragraph
- Register requires fullName, email, phone, password (matches backend) — login is just email + password

### Header navigation UX ([src/components/shared/header/Header.tsx](src/components/shared/header/Header.tsx))

- Mobile menu "Go to Dashboard" button (logged in) uses `useTransition` + `router.push('/dashboard')` so it shows a spinner during the slow dashboard load (Render cold start + `/me` call). Was previously `<Link><Button></Button></Link>` (button-inside-anchor — invalid HTML).

### Mutations

- **Default**: Server Actions + `revalidatePath()` to refetch Server Component data
- **Cart**: SWR with `fallbackData` from a Server Component (initial data server-rendered, then SWR handles client-side mutations and revalidation). Decision deferred until cart endpoint shape is known — may start with Server Actions and only add SWR if the UX feels sluggish.

### Forms

- **react-hook-form** + **Zod** schemas with `@hookform/resolvers/zod`
- Schemas in `src/lib/schemas/` (e.g. `auth.ts`)
- Server Actions re-validate with the same Zod schema (defense-in-depth — never trust client validation)
- Validation errors from backend (`422` with `errors: { field: [...] }`) are mapped onto RHF field errors

### Error handling

- Services return exactly what the backend returns (no wrapping/transforming) — easier to debug
- Server Actions catch axios errors and return a `{ ok: false, message, fieldErrors? }` shape (`FormActionResult`) to the form for inline rendering
- Toasts/inline messages render the backend's `message` directly

### TypeScript types ([src/types/api.ts](src/types/api.ts))

- Hand-written
- `User` has all `/me` fields (`isActive`, `createdAt`, `updatedAt` optional since login's user is a subset)
- `ApiResponse<T>` discriminated union for success vs failure
- `Specialty = { specialty: string; count: number }`
- `Case`, `CasesPage`, `CaseDetail`, `BloodTestRow`, `MarkingSchemeSection`, `FurtherResource`, `PatientData`, `PatientDataDetail`
- `JwtPayload`, `AuthTokens`, `AuthSuccessData`, `FormActionResult`, `Role`

### Env vars

- `API_URL` (server-only — NOT prefixed with `NEXT_PUBLIC_`) — backend base URL. Currently `https://nativemed.onrender.com`. `.env.local` is gitignored.

## Case detail page architecture (A2 adapter pattern)

The detail page renders into 5 existing tab components (`FullCase`, `Patient`, `Doctor`, `Examiner`, `Resources`) that were originally written against a hand-crafted mock shape ([MockCasesPresentationInterface.tsx](src/types/MockCasesPresentationInterface.tsx)). Rather than refactor all 5 components, we kept the mock-shape contract and built a **one-way adapter** ([adaptCase.ts](src/app/(marketplace)/full-cases/[cases]/[id]/_components/adaptCase.ts)) that maps the API's `CaseDetail` to the mock shape.

### Why "A2" (placeholder fields, not hidden sections)

Several mock fields don't exist as top-level fields in the API (e.g. `socialHistory`, `importantNote`, `safetyNet`, `patientsIdeaConcernExpectation`, `questionsForDoctor`). When the adapter can't fill them from API data, it falls back to em-dash (`"—"`) for strings and `[]` for arrays. The components keep rendering the section headings either way. This way:
- UI structure stays consistent across cases (no "shorter on some, longer on others")
- When the backend later adds a field, the adapter is the only file to update — no component rework
- When we're sure a field will never come from backend, deletion is a localised one-line change

### Patient story parser ([adaptCase.ts](src/app/(marketplace)/full-cases/[cases]/[id]/_components/adaptCase.ts))

The API's `patientStory` is a single freeform text blob containing labeled sections. `parsePatientStory()` extracts them into the mock fields:

| Mock field | Label patterns matched |
|---|---|
| `socialHistory` | `^Social\s+history\s*:` (case-insensitive) |
| `patientsIdeaConcernExpectation` | `^Ideas?\s*:` / `^Concerns?\s*:` / `^Expectations?\s*:` (singular OR plural) |
| `questionsForDoctor` | `^Questions?\s+for\s+the\s+[Dd]octor\s*[?:]?` (handles multi-paragraph content following the label) |
| `importantNote` | `^Say\s+NO\s+to\s+any\s+other...` (whole paragraph) |

Algorithm: split `patientStory` by blank lines, test each paragraph against the label regexes. For `questionsForDoctor`, paragraphs after the label without a competing label get appended (handles multi-paragraph instructions). When a label doesn't appear in a particular case, the corresponding mock field falls back to em-dash / `[]`.

**ICE label inconsistency** — observed both singular (`"Idea:"`) and plural (`"Ideas:"`) across cases; regex handles both.

### Safety-net extractor ([adaptCase.ts](src/app/(marketplace)/full-cases/[cases]/[id]/_components/adaptCase.ts))

`extractSafetyNet()` scans the `management` array for any item containing `/safety[-\s]?net/i`. When found:
- Strips the label prefix (everything up to the first colon) → goes into `safetyNet` field
- Removes that item from the management array (so it doesn't render twice)

Catches all 3 phrasings observed (`"Safety net:"`, `"Safety netting advice:"`, `"Provide clear safety-netting advice:"`).

## Pages — what's wired vs not

| Page | Status | Notes |
|---|---|---|
| `/` (home) | static UI, no API | layout fetches user for header |
| `/about`, `/contact`, `/cart` | static UI, no API | cart UI is mock data |
| `/products`, `/products/[id]` | static UI (mock data) | uses `ProductsCard` with hardcoded array — needs courses.service when backend `/courses` is wired |
| `/login`, `/register` | ✅ FULLY WIRED | RHF + Zod + Server Actions + cookies + redirect |
| `/dashboard` | wrapped by marketplace auth gate | page itself is mostly placeholder UI |
| `/courses` | static UI (mock data) | needs `courses.service.getCourses()` |
| `/full-cases` | ✅ WIRED | `getSpecialties()` → 16 specialty cards + an "All Cases" card whose count = sum of all specialty counts |
| `/full-cases/[cases]` | ✅ WIRED | Slug-based — `"all"` → `getAllCases(page)`, anything else → `findBySlug` against specialties → `getCasesBySpecialty(name, page)`. Pagination via `?page=N`. List shows specialty (purple) on All Cases view, difficulty (color-coded) on specialty pages. |
| `/full-cases/[cases]/[id]` | ✅ WIRED | `getCase(id)` → adapter → 5 tabs. Banner shows case title + Station/Specialty/ConsultationType/Difficulty badges. |
| `/subscriptions` | static UI, no endpoint exists | |
| `/settings` | placeholder "Under Construction" | |

## URL slug strategy for specialties

- `slugify(name)` in [src/lib/slug.ts](src/lib/slug.ts) turns `"ENT & Eye"` → `"ent-eye"`, `"Men's Health"` → `"mens-health"`
- `findBySlug(slug, items, getName)` finds the original item by re-slugifying each candidate
- The detail page's path uses the original slug as `parentSlug` so back-links land on the correct specialty page
- The "all" slug is reserved for the All Cases view (not derived from any specialty)

## Build order — current state

1. ✅ `lib/api.ts` (axios instance + interceptors) + `lib/session.ts` + `lib/jwt.ts`
2. ✅ `services/auth.service.ts` + login/register Server Actions + wire up [AuthForm.tsx](src/components/shared/AuthForm.tsx)
3. ✅ `proxy.ts` (project root) proactive refresh (Strategy B)
4. ✅ `(marketplace)/layout.tsx` real auth check via `/auth/me`
5. ✅ Logout: SideNav "Log Out" wired to Server Action via `<form action={logoutAction}>`
6. ✅ Public layout fetches user → header shows NamedHeader (cart/avatar/name) when logged in
7. ✅ Spinners on Sign In / Sign Up / Go to Dashboard buttons
8. ✅ `cases.service.getSpecialties()` + `/full-cases` page wired to real specialties (with "All Cases" total)
9. ✅ `cases.service.getAllCases() + getCasesBySpecialty()` + wire `/full-cases/[cases]` with pagination
10. ✅ `cases.service.getCase()` + adapter + parsers + wire `/full-cases/[cases]/[id]`
11. ⏳ `courses.service.ts` → replace mock data on `/courses` and `/products`
12. ⏳ Cart, payments, admin features (later, when endpoints exist)
13. ⏳ Handle `mustChangePassword` flag (build `/change-password` page + redirect logic)

## Where we left off (for the next session)

**Just completed — case detail integration polish:**
- All 3 case pages wired end-to-end against the live Render backend.
- Adapter parses `patientStory` into structured mock fields (socialHistory, ICE, questionsForDoctor, importantNote) — em-dashes appear only when a section is genuinely absent from a case.
- `safetyNet` extracted from `management` array (flexible regex handles 3 phrasing variants).
- Blood test rows render with `isAbnormal` red highlighting + ⚠ marker.
- `furtherResources` rendered as clickable links opening in a new tab.
- Patient.tsx cleanup: deleted hardcoded "If asked about periods/supplements" block (was wrong on every case), empty arrays now render an em-dash row instead of a heading floating with no content.

**Sample IDs for testing** (from cases tested):
- `69f5a432e6becd6b6ba0a5f2` (Gynaecology — Bleeding In Pregnancy)
- `69f5a433e6becd6b6ba0a5f7` (Endocrinology — Abnormal Thyroid Function — has `isAbnormal` blood rows)
- `69f5a433e6becd6b6ba0a5f6` (Respiratory — COPD Flare-Up — multiple PMH)
- `69f5a432e6becd6b6ba0a5f4` (Paediatric ENT — Telephone Consultation, parent role-player)

**A temporary `console.log` is still in `[cases]/page.tsx`** that prints the first case `_id` of each list page request. Useful for grabbing IDs to test in Postman; remove when done debugging.

**Suggested next moves:**
1. **Courses integration** — test `GET /api/v1/courses` in Postman, build `courses.service.ts`, wire `/products` and `/courses` pages similarly to how cases were done.
2. **Cart endpoint** when backend ships it.
3. **`mustChangePassword`** flow — needs a `/change-password` page; redirect on login when flag is true.
4. **Polish suggestions for case detail** (deferred from earlier discussion):
   - Sticky "Start Consultation" CTA at top of detail page
   - Move toward an exam-mode flow (timer + checklist for marking scheme + score)
   - Refactor Resources component to take `{title, url}[]` directly (already done — type updated)

## Responsive design conventions

Mobile-first. Container padding pattern: `px-4 sm:px-8 md:px-10 lg:px-15` for `(public)`. Card grids use `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` (no skipping `md:`). Headings scale through all four breakpoints (`text-2xl sm:text-3xl md:text-5xl lg:text-7xl`). See [src/app/globals.css](src/app/globals.css) for custom theme tokens and utility classes (`radialBgGradient`, `cardShadow`, `authFormBorder`, `authFormBg`, `questionBankShadow`, etc.).

## Commands

- `npm run dev` — start dev server (port 3000, fallback 3001 if in use)
- `npm run build` — production build (Turbopack)
- `npm run lint` — eslint

## Gotchas / things to remember

- **`proxy.ts` is at the project ROOT**, not `src/`. The function must be exported as `proxy` (Next 16 rename from `middleware`). When deleting/moving, also delete `.next` cache to clear stale module references.
- **`<Link>` wrapping `<Button>`** is invalid HTML (anchor-inside-button). Use `<Button asChild><Link>...</Link></Button>` (shadcn pattern), or programmatic `router.push` with `useTransition` for spinner UX.
- **Server Components can't `setSession()`** — only Server Actions, Route Handlers, and Middleware can. The session helpers swallow this error in `setSession`/`clearSession` callers.
- **Refresh token rotation is enabled** — every refresh issues new access AND new refresh. The interceptor and proxy must update BOTH cookies on each refresh, not just access.
- **The `redirect()` from `next/navigation` throws** a special error to perform navigation. Don't put it inside a try/catch that swallows everything — it'll silently fail. Either rethrow `isRedirectError` or call `redirect()` outside the try block.
- **`(public)` routes are dynamic now** because the layout reads cookies for the user fetch. If you ever need static caching back, isolate the user fetch in a Suspense boundary.
- **Render free tier cold starts** — first request after idle takes 30–60s. The `useTransition` spinner on "Go to Dashboard" exists specifically for this.
- **The Postman environment** auto-saves tokens to `pm.environment.set` (we updated the script from `collectionVariables`). Each login overwrites the env tokens — use the most recent.
- **`tsconfig.json` targets ES2017** — the regex `s` flag (dot-matches-newline) is NOT available. Use `[\s\S]` instead of `.` in any multiline regex match. Also true for `?.flat()`-like newer methods if added.
- **Adapter pattern (case detail)**: the existing tab components consume a hand-crafted "mock shape" not the API shape. Always go through `adaptCase()`. When you add a new field to the mock interface or the API, update the adapter — that's the only mapping layer.
- **Patient story parser is heuristic** — relies on label patterns observed in 4 sampled cases. If a new case uses different labels, the corresponding mock field will fall back to em-dash. This is intentional (A2): visible em-dash signals "data not parseable here", which is better than silently dropping content.
- **Case detail empty states**: when `getCase()` fails or returns `success: false`, the page renders a "Case not found" banner instead of crashing. Same defensive pattern in `[cases]/page.tsx` for the list endpoints.
- **Do NOT fix unprompted UI/copy unless asked** — the user wants control over visual changes. Explain what you'd change, then ask.
