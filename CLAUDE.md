# Native-Med — Project Context

## What this project is

Native-Med is an online medical education platform for UK medical professionals preparing for the **MRCGP SCA exam**. It's a B2C SaaS product with three areas:

- **Public marketing site** — home, about, contact, products listing
- **Auth** — login, register, password reset
- **Marketplace** (authenticated) — dashboard, courses, mock exam cases, subscriptions, settings

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
src/
├── app/
│   ├── (public)/         marketing site (server components)
│   ├── (auth)/           login, register
│   └── (marketplace)/    dashboard, courses, mock, subscriptions, settings
├── components/
│   ├── shared/           cross-cutting components (Header, Footer, ProductsCard, etc.)
│   └── ui/               shadcn primitives
├── lib/
│   ├── utils.ts          cn helper
│   ├── api.ts            axios instance + interceptors
│   ├── session.ts        cookie helpers (set/get/clear tokens)
│   ├── jwt.ts            decode JWT exp claim (no signature verify)
│   └── schemas/          Zod schemas (e.g. auth.ts)
├── services/
│   ├── auth.service.ts   login, register, refresh, logout, me
│   ├── courses.service.ts
│   └── cases.service.ts
├── types/
│   ├── api.ts            ApiResponse<T>, User, error types
│   └── MockCasesPresentationInterface.tsx
└── hooks/                empty, for future custom hooks
```

`proxy.ts` lives at the **project root** (next to `package.json`), not inside `src/`. Next.js 16 supports either location; we keep it at root.

**Convention**: route-group-specific components live in `_components/` folders inside the route group (e.g. `src/app/(public)/_components/Hero.tsx`). Cross-cutting components live in `src/components/shared/`.

## Backend API

The backend lives at **`http://localhost:5000`** in dev (a Render production URL is coming — base URL is configurable via `API_URL` env var). API is versioned at `/api/v1/...`.

A Postman collection (`NativeMed.postman_collection.json` + environment) has been imported and exercised. Below are the **confirmed** shapes from real Postman responses.

### Response envelope (universal)

Every endpoint wraps its payload:
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
| Other 4xx (not found, forbidden, etc.) | `4xx` | `{ success: false, message }` |

### Auth (`/api/v1/auth`)

**Login / Register response** (identical shape — register auto-logs in):
```ts
{
  success: true,
  message: "Login successful" | "Registration successful",
  data: {
    accessToken: string,    // JWT
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
    _id: string,
    fullName: string,
    email: string,
    phone: string,
    role: "user" | "admin",
    isActive: boolean,
    mustChangePassword: boolean,
    createdAt: string,   // ISO
    updatedAt: string,
  }
}
```

**`POST /refresh-token` response** — both tokens rotate (old refresh token is invalidated):
```ts
{
  success: true,
  message: "Token refreshed",
  data: { accessToken: string, refreshToken: string }
}
```

### JWT facts

- Access token is a JWT signed HS256, payload: `{ _id, email, role, iat, exp }`
- **Access token TTL: 15 minutes** (decoded from `exp - iat = 900`)
- Refresh token is **opaque** (not a JWT) — backend looks it up
- **Refresh token TTL: pending — to confirm with backend dev**
- **Refresh token rotation: enabled** — every refresh issues NEW access AND new refresh; old refresh becomes invalid

### `mustChangePassword` flag

- Likely flips to `true` for admin-created users (`POST /auth/admin/users`)
- Auth flow must check this and force password change before granting full access

### Confirmed endpoints

- **Health**: `GET /health`
- **Auth** (`/api/v1/auth`): register, login, refresh-token, logout, logout-all, forgot-password, reset-password, change-password, me (GET/PATCH), admin user management
- **Courses** (`/api/v1/courses`): list, get by id, CRUD (admin), thumbnail upload (multipart), publish toggle
- **Course Content** (`/api/v1/courses/:courseId/content`): list, get, CRUD (admin), file upload (multipart) with `title`, `type`, `order`, `duration`
- **Cases** (`/api/v1/cases`): list (paginated `?page=1&limit=12`), get, specialties list, CRUD (admin), publish, duplicate, admin-only listing

### Confirmed product/business decisions

- **Courses == products** in the data model. `/products` and `/courses` pages both render data from the courses endpoint.
- **Roles**: `"user"` and `"admin"` (lowercase). `role` is in BOTH the JWT and `/me` response — middleware can decode JWT directly without a `/me` call.
- **Backend uses Zod for validation** (error message "Invalid input: expected string, received undefined" is Zod default) — frontend Zod schemas can mirror backend constraints.

### Endpoints NOT yet in the API (waiting on backend)

These features exist in the frontend designs but have no backend endpoint yet — to be added or confirmed as static:

- **Cart** — endpoint coming, shape TBD
- **Subscriptions / payments / checkout** — Stripe + PayPal mentioned in UI, no endpoints yet
- **Newsletter signup** (footer)
- **Contact form** (`/contact` page)
- **Course progress tracking** (cards show "% complete" but no endpoint)
- **Mock case attempt tracking**
- **Search** (marketplace search bars)
- **Email verification** on register
- **Testimonials, FAQ, founder bio** — currently static, may stay static

### Pending questions for backend dev

- **Refresh token TTL** (drives cookie max-age and how aggressive proactive refresh should be)

## Architecture decisions for API integration

### Server-side fetching (idiomatic Next.js App Router)

- Server Components fetch data directly via service functions and pass it to Client Components as props
- No proxy route handlers for read-only data (we're **not** doing a full BFF)
- The Next.js server is effectively the BFF — tokens stay server-side, never touch the browser

### HTTP client: axios with interceptors

One axios instance in `src/lib/api.ts`:

- `baseURL` = `${process.env.API_URL}/api/v1`
- **Request interceptor**: reads `accessToken` cookie via `next/headers`, attaches `Authorization: Bearer <token>`
- **Response interceptor** logic:

```
On 401:
  if URL is /auth/login | /auth/register | /auth/refresh-token
    → don't refresh, surface error to form
  else
    → call /auth/refresh-token once
    → if refresh succeeds → update both cookies, retry original request
    → if refresh fails → clear cookies, redirect to /login

On 422:
  → don't refresh, surface validation errors to RHF (map errors[field][0] to field)

On other 4xx/5xx:
  → don't refresh, surface message via the response envelope
```

**Note**: axios loses Next.js's built-in `fetch()` cache. Acceptable trade-off — auth-gated routes shouldn't be cached anyway.

### Auth flow

- **Login/Register**: form → Server Action → axios call → backend returns tokens → set `accessToken` and `refreshToken` as **httpOnly cookies** → if `mustChangePassword` → redirect to change-password page, else `redirect('/dashboard')`
- **Cookies**: managed via `src/lib/session.ts` helpers using `next/headers` `cookies()`
  - Names: `accessToken`, `refreshToken`
  - Options: `httpOnly: true`, `secure: production-only`, `sameSite: 'lax'`, `path: '/'`
  - `accessToken` cookie max-age: **15 min** (matches JWT TTL)
  - `refreshToken` cookie max-age: TBD when backend confirms TTL — placeholder constant `REFRESH_TOKEN_MAX_AGE` until then
- **Tokens never leave the server** — XSS-safe by construction

### Two-layer auth gate for `(marketplace)` — Strategy B (proactive)

1. **Middleware** (`proxy.ts (project root)`):
   - Reads `accessToken` cookie on every `(marketplace)/*` request
   - If missing → redirect to `/login`
   - If present, decodes JWT `exp` claim (base64-decode payload, no signature verify — Edge-runtime safe)
   - If expired or near-expiry (within ~30s) AND `refreshToken` exists → call `/auth/refresh-token`
     - On success: set new `accessToken` + `refreshToken` cookies on both the forwarded request and the response (so the Server Component sees the new token)
     - On failure: clear cookies, redirect to login
2. **Marketplace layout** (`src/app/(marketplace)/layout.tsx`):
   - Server Component calls `auth.service.me()`
   - On 401 (rare, since middleware already handled refresh) → `redirect('/login')`
   - On success → passes user object down via props (or React context)

Real auth enforcement happens at the backend on every API call. Middleware does proactive UX-smoothing.

**Future**: admin-only routes go in a separate `(admin)` route group with its own layout that checks `user.role === 'admin'`.

### Mutations

- **Default**: Server Actions + `revalidatePath()` to refetch Server Component data
- **Cart**: SWR with `fallbackData` from a Server Component (initial data server-rendered, then SWR handles client-side mutations and revalidation). Final decision deferred until cart endpoint shape is known — may start with Server Actions and only add SWR if the UX feels sluggish.

### Forms

- **react-hook-form** + **Zod** schemas with `@hookform/resolvers/zod`
- Schemas in `src/lib/schemas/` (e.g. `auth.ts`)
- Server Actions accept `FormData`, re-validate with same Zod schema (defense-in-depth — never trust client validation)
- Validation errors from backend (`422` with `errors: { field: [...] }`) are mapped onto RHF field errors

### Error handling

- Services return exactly what the backend returns (no wrapping/transforming) — easier to debug
- Server Actions catch axios errors and return a `{ ok: false, message, fieldErrors? }` shape to the form for inline rendering
- Toasts/inline messages render the backend's `message` directly

### TypeScript types

- Hand-written in `src/types/api.ts`
- One `User` type with all `/me` fields (`isActive`, `createdAt`, `updatedAt` etc. optional since login's user is a subset)
- `ApiResponse<T>` discriminated union for success vs failure

### Env vars

- `API_URL` (server-only — NOT prefixed with `NEXT_PUBLIC_`) for the backend base URL — keeps backend URL invisible to the browser
- Cookie names and TTLs as constants in `lib/session.ts`

## Build order

1. ✅ `lib/api.ts` (axios instance + interceptors) + `lib/session.ts` + `lib/jwt.ts`
2. ✅ `services/auth.service.ts` + login/register Server Actions + wire up [src/components/shared/AuthForm.tsx](src/components/shared/AuthForm.tsx)
3. ✅ `proxy.ts (project root)` proactive refresh (Strategy B)
4. ✅ `(marketplace)/layout.tsx` real auth check via `/auth/me`
5. ⏳ Logout: convert SideNav "Log Out" link to a button-with-Server-Action
6. ⏳ `courses.service.ts` → replace mock data on `/courses` and `/products`
7. ⏳ `cases.service.ts` → wire up `/mock` pages
8. ⏳ Cart, payments, admin features (later, when endpoints exist)

## Responsive design conventions

Mobile-first. Container padding pattern: `px-4 sm:px-8 md:px-10 lg:px-15` for `(public)`. Card grids use `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` (no skipping `md:`). Headings scale through all four breakpoints (`text-2xl sm:text-3xl md:text-5xl lg:text-7xl`). See [src/app/globals.css](src/app/globals.css) for custom theme tokens and utility classes (`radialBgGradient`, `cardShadow`, `authFormBorder`, etc.).

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (Turbopack)
- `npm run lint` — eslint
