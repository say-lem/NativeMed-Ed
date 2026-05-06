# Native-Med — Project Context

## What this project is

Native-Med is an online medical education platform for UK medical professionals preparing for the **MRCGP SCA exam**. It's a B2C SaaS product with three areas:

- **Public marketing site** — home, about, contact, products listing
- **Auth** — login, register, password reset
- **Marketplace** (authenticated) — dashboard, courses, full-cases (mock exam cases), subscriptions, settings

Branding: purple primary `#5925B3` + navy secondary `#1C3967`, Fustat font.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
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
    │       └── _components/MarketplaceShell.tsx   client shell with sidebar state
    ├── components/
    │   ├── shared/         Header, NamedHeader, Footer, AuthForm (RHF+Zod), etc.
    │   └── ui/             shadcn primitives (Button only)
    ├── lib/
    │   ├── utils.ts        cn helper
    │   ├── api.ts          axios instance + interceptors (request: cookie→Authorization, response: 401→refresh→retry)
    │   ├── session.ts      cookie helpers (httpOnly accessToken/refreshToken)
    │   ├── jwt.ts          decode JWT exp (base64, no signature verify, Edge-safe)
    │   ├── slug.ts         slugify() + findBySlug() — used for specialty URLs
    │   └── schemas/auth.ts Zod schemas: loginSchema, registerSchema
    ├── services/
    │   ├── auth.service.ts        login, register, refresh, logout, me
    │   └── cases.service.ts       getSpecialties() (more pending — backend bug)
    ├── types/
    │   ├── api.ts          ApiResponse<T>, User, AuthTokens, Specialty, FormActionResult, JwtPayload
    │   └── MockCasesPresentationInterface.tsx
    └── hooks/              empty, for future custom hooks
```

`proxy.ts` lives at the **project root** (next to `package.json`), not inside `src/`. Next.js 16 supports either location; we keep it at root.

**Convention**: route-group-specific components live in `_components/` folders inside the route group (e.g. `src/app/(public)/_components/Hero.tsx`). Cross-cutting components live in `src/components/shared/`.

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

**`GET /cases/specialties`** ✅ CONFIRMED — used by `/full-cases` page:
```ts
{
  success: true,
  message: "Specialties fetched",
  data: Array<{ specialty: string; count: number }>
}
```
16 specialties returned currently (Cardiology, Dermatology, ENT & Eye, Endocrinology, Ethics, Gastroenterology, General Practice, Genetics, Gynaecology, Infectious Disease, Men's Health, Mental Health, Neurology, Paediatrics, Respiratory, Rheumatology). Counts vary (1–41).

**`GET /cases?page=1&limit=12`** ⛔ **BACKEND BUG (500)** — handler crashes regardless of query params (also fails with `?specialty=Cardiology`). Reported to backend dev. Blocks the case-list and case-detail page integration.

**`GET /cases/:id`** ⛔ Untested but likely affected by same bug if it shares model code.

### `mustChangePassword` flag

- Likely flips to `true` for admin-created users (`POST /auth/admin/users`)
- Auth flow should check this and force password change before granting full access (currently NOT implemented — just redirects to /dashboard regardless)

### Confirmed product/business decisions

- **Courses == products** in the data model. `/products` and `/courses` pages both render data from the courses endpoint (when wired).
- **Roles**: `"user"` and `"admin"` (lowercase). `role` is in BOTH the JWT and `/me` response — middleware can decode JWT directly without a `/me` call.
- **Backend uses Zod for validation** (error message "Invalid input: expected string, received undefined" is Zod default) — frontend Zod schemas can mirror backend constraints.

### Endpoints NOT yet in the API (waiting on backend)

These features exist in the frontend designs but have no backend endpoint yet:

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
- **`GET /cases` 500 crash** — open bug, blocks case integration

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
- `JwtPayload`, `AuthTokens`, `AuthSuccessData`, `FormActionResult`, `Role` also defined

### Env vars

- `API_URL` (server-only — NOT prefixed with `NEXT_PUBLIC_`) — backend base URL. Currently `https://nativemed.onrender.com`. `.env.local` is gitignored.

## Pages — what's wired vs not

| Page | Status | Notes |
|---|---|---|
| `/` (home) | static UI, no API | layout now fetches user for header |
| `/about`, `/contact`, `/cart` | static UI, no API | cart UI is mock data |
| `/products`, `/products/[id]` | static UI (mock data) | uses `ProductsCard` with hardcoded array — needs courses.service when backend `/courses` is wired |
| `/login`, `/register` | ✅ FULLY WIRED | RHF + Zod + Server Actions + cookies + redirect |
| `/dashboard` | wrapped by marketplace auth gate | page itself is mostly placeholder UI |
| `/courses` | static UI (mock data) | needs `courses.service.getCourses()` |
| `/full-cases` | ✅ WIRED (specialties grid) | server-side fetch via `getSpecialties()`, slugified URLs |
| `/full-cases/[cases]` | ⛔ BLOCKED | needs `getCases({specialty})` — backend `/cases` returns 500 |
| `/full-cases/[cases]/[id]` | ⛔ BLOCKED | needs `getCase(id)` — backend probably also 500 |
| `/subscriptions` | static UI, no endpoint exists | |
| `/settings` | placeholder "Under Construction" | |

## URL slug strategy for specialties

- `slugify(name)` in [src/lib/slug.ts](src/lib/slug.ts) turns `"ENT & Eye"` → `"ent-eye"`, `"Men's Health"` → `"mens-health"`
- `findBySlug(slug, items, getName)` finds the original item by re-slugifying each candidate
- Used to navigate from `/full-cases` → `/full-cases/<specialty-slug>` and (eventually) to look up the original specialty name on the destination page so we can hit the API filter

## Build order — current state

1. ✅ `lib/api.ts` (axios instance + interceptors) + `lib/session.ts` + `lib/jwt.ts`
2. ✅ `services/auth.service.ts` + login/register Server Actions + wire up [AuthForm.tsx](src/components/shared/AuthForm.tsx)
3. ✅ `proxy.ts` (project root) proactive refresh (Strategy B)
4. ✅ `(marketplace)/layout.tsx` real auth check via `/auth/me`
5. ✅ Logout: SideNav "Log Out" wired to Server Action via `<form action={logoutAction}>`
6. ✅ Public layout fetches user → header shows NamedHeader (cart/avatar/name) when logged in
7. ✅ Spinners on Sign In / Sign Up / Go to Dashboard buttons
8. ✅ `cases.service.getSpecialties()` + `/full-cases` page wired to real specialties
9. ⏳ `cases.service.getCases({specialty?, page, limit})` + wire `/full-cases/[cases]` — **BLOCKED on backend 500 bug**
10. ⏳ `cases.service.getCase(id)` + wire `/full-cases/[cases]/[id]` — **BLOCKED on backend**
11. ⏳ `courses.service.ts` → replace mock data on `/courses` and `/products`
12. ⏳ Cart, payments, admin features (later, when endpoints exist)
13. ⏳ Handle `mustChangePassword` flag (build `/change-password` page + redirect logic)

## Where we left off (for the next session)

**Just completed:**
- `/full-cases` page integration: 16 specialty cards from `/cases/specialties`, real counts, slugified URLs (`/full-cases/cardiology`, `/full-cases/ent-eye`, etc.)
- Banner text changed from "Mock Cases" → "Case Bank"
- Fixed stale `/mock` and `mockCases` references in routes after user renamed folders to `/full-cases` and `[cases]`

**Currently blocked:**
- Backend `GET /api/v1/cases` returns `500 Internal Server Error` ("Something went wrong"). Same with `?specialty=Cardiology`. Reported to backend dev. Until fixed, can't wire up the next two pages.

**Suggested next moves:**
1. **Wait for backend fix** on `/cases` → resume case integration. Expected next: test the GET /cases response shape, add `Case` type, add `getCases()` and `getCase(id)` to cases.service, wire the two remaining pages.
2. **OR pivot to courses** — test `GET /api/v1/courses` in Postman. If it works, wire `/products` and `/courses` pages similarly. The courses endpoint hasn't been exercised yet.
3. **OR public site polish** — work on responsive issues, contact form, footer newsletter (skip the backend wiring, just collect inputs).

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
- **Do NOT fix unprompted UI/copy unless asked** — the user wants control over visual changes. Explain what you'd change, then ask.
