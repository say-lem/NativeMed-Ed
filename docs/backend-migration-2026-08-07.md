# Backend migration — Courses, Subscriptions & Stripe (received 2026-08-07)

Tracking doc for the frontend work needed after the backend's "Frontend Integration Guide —
Courses, Subscriptions & Stripe" + refreshed Postman collection.

**Status legend:** `[ ]` todo · `[x]` done · `[~]` in progress · `[!]` blocked

---

## 0. Questions for backend — ANSWERED 2026-08-07

- [x] **Q1 — Case Bank free tier** → **5 free cases stays; backend handles it.** The guide's
      "403 without subscription" is wrong. No frontend paywall needed. **Phase 7 = verify only.**
- [x] **Q2 — Lesson delivery** → **PDF lessons and Google Drive both stay.** Additionally: admins
      should be able to upload **lectures** and **work sessions** as content. Phase 6 unblocked —
      keep the in-app viewer. *(Backend was unsure; we proceed on this and adjust.)*
- [x] **Q3 — Stripe mode** → **live for now.** Integrate but **do not run end-to-end checkout
      tests**; backend is switching to test mode so we can test later. Phase 3/5 code can land;
      their test checkboxes stay unticked until then.
- [x] **Q4 — Tier value migration** → **backend is migrating; use the new names only.** No legacy
      `pdf_only`/`pdf_drive` support needed (label maps already fall back to the raw value, so a
      stale record degrades to readable text rather than crashing).
- [x] **Q5 — Orphaned enrollments** → **backend will fix.** No frontend action.
- [x] **Q6 — Drive links on admin GET** → **backend will fix.** Build the edit form to prefill
      when present, tolerate absent.
- [x] **Q7 — Old `price` field** → **gone.** Clean removal, no legacy fallback.

### New questions raised by those answers

- [ ] **Q8 — PDF lessons stay, so the Cloudinary 401 is still a live blocker.** Lesson `fileUrl`s
      are private Cloudinary assets; our proxy gets `401 deny or ACL failure` and can't stream
      them. Keeping PDF lessons means this still needs a **signed URL or a backend stream
      endpoint**. This was CLAUDE.md §7 blocker #2 and is **not** resolved by Q2's answer —
      in-app PDFs remain non-functional until it is. **Blocks Phase 6 testing.**
- [ ] **Q10 — The two course tiers cannot be priced differently. Is that intended?**
      **Verified against the live API 2026-08-07**, not just the doc:
      `GET /payments/plans` → both course tiers return `"prices": []`;
      `GET /courses` → the only price fields that exist on a course are `priceMonthly` and
      `priceQuarterly` (full key set: `_id, title, description, priceMonthly, priceQuarterly,
      isPublished, thumbnailUrl, createdAt, updatedAt`).
      So **there is no per-tier price anywhere in the system** — "Mock Sessions Only" and
      "Mock Sessions + Lectures" necessarily cost the same.
      Consequence: the higher tier strictly includes the lower one at an identical price, so no
      buyer will ever choose the lower tier — lectures are effectively free. Either the course
      model needs a price per tier, or the tier choice should be dropped and every buyer gets
      both. **Business decision + backend change; the frontend currently displays the data
      honestly (same price on both cards).**
- [ ] **Q9 — How is a content item tagged as lecture vs work session?** The tiers are
      `mocksessions_only` vs `mocksession_and_lectures`, so access depends on knowing which
      bucket a lesson is in — but `POST content/drive-link` and `content/upload-pdf` only accept
      `type: "pdf"|"video"`, which is file format, not category. We need a field like
      `category: "lecture" | "mocksession"` on course content, otherwise tier gating can't work
      and "upload a lecture / work session" has nowhere to store the distinction.

---

## Phase 1 — Unbreak admin course create/edit (no dependencies, do first)

`POST /courses` now **rejects our payload**: it requires at least one of
`priceMonthly`/`priceQuarterly` plus **both** Drive folder links. Course creation is broken today.

- [x] `Course` type: replaced `price` with `priceMonthly?` / `priceQuarterly?`, plus optional
      Drive fields for when backend exposes them — [src/types/api.ts](../src/types/api.ts)
- [x] `CourseInput`: `priceMonthly?`, `priceQuarterly?`, `lecturesDriveFolderId`,
      `mockSessionsDriveFolderId`, `isPublished?`; `price` dropped
- [x] `Enrollment.courseId` populated shape: new price fields, and typed `| null` (the deleted-
      course case that broke `/my-courses`)
- [x] Zod schema is now a factory `makeCourseSchema("create" | "edit")` — Drive links required on
      create, **optional on edit** (they're never returned, so requiring them would force an admin
      to re-paste both just to fix a title) — [src/lib/schemas/course.ts](../src/lib/schemas/course.ts)
- [x] `courseToFormValues` / `buildCoursePayload` — empty price → field omitted (interval not
      offered); empty Drive link → omitted, so a PATCH can't wipe the stored folder
- [x] Form UI: Pricing fieldset (monthly £ / quarterly £) + Google Drive fieldset with the
      service-account helper text, and an edit-mode note that blank = keep current folders —
      [UploadCourseForm.tsx](<../src/app/(admin)/admin-courses/upload-course/_components/UploadCourseForm.tsx>)
- [x] Admin course list price column shows both intervals —
      [AdminCourses.tsx](<../src/app/(admin)/admin-courses/_components/AdminCourses.tsx>)
- [x] Shared price helpers (pounds, not pence) in [src/lib/price.ts](../src/lib/price.ts):
      `formatMoney`, `courseBadgePrice`, `courseAdminPrice`, `availableIntervals`,
      `priceForInterval`. Replaced the two duplicated local `formatPrice` functions.
- [x] Member course card badge uses `courseBadgePrice` —
      [CoursesCard.tsx](<../src/app/(marketplace)/courses/_components/CoursesCard.tsx>).
      Note: a missing price now means **"interval not offered"**, not "Free" — the old card
      rendered `price == null` as **"Free"**, which would have been wrong and revenue-affecting.
- [x] `saveCourseAction` sends `isPublished` on create (now supported) instead of always firing a
      second publish request; the reconcile call remains as a fallback —
      [upload-course/actions.ts](<../src/app/(admin)/admin-courses/upload-course/actions.ts>)
- [x] `npx tsc --noEmit` + `npx eslint` clean

**Accepted Drive formats** (backend extracts the ID): raw ID, `/drive/folders/<ID>`,
`/file/d/<ID>/view`, `/open?id=<ID>`. Invalid → `400 "Invalid Google Drive folder link or ID"`.

### Test — all passed against the live backend 2026-08-07

- [x] Create with both prices + both Drive links → saved, card shows
      `£49.99/mo · £129.99/qtr`
- [x] Create with only `priceMonthly` → saved, card shows `£49.99/mo` only (no quarterly)
- [x] Create with no price → blocked client-side ("Set a monthly price, a quarterly price, or
      both"); Network tab confirmed **no request fired**
- [x] Junk Drive value (`hello`) → blocked client-side, message rendered **under the field**
- [x] Publish → appears in the admin list as Published
- [x] **Edit title only, Drive boxes left blank → saved with no Drive validation error** (the
      create-vs-edit schema split works; PATCH omitted the empty Drive fields)

Also found + fixed during testing: the form threw away the backend's per-field `errors` map and
only showed a generic "Validation failed" toast. A real Drive-folder rejection (a
`docs.google.com/document/...` link, which the backend correctly refuses) gave no indication of
*which* field was wrong. Now mapped onto the inputs via the new shared
[src/lib/form-errors.ts](../src/lib/form-errors.ts) `applyFieldErrors`.

**Not covered:** whether the stored Drive folder IDs genuinely survive a PATCH — no GET returns
them, so it can't be observed from the frontend. Worth confirming with backend (Q6) or in the DB.

---

## Phase 2 — Access tier rename

`pdf_only` → **`mocksessions_only`**, `pdf_drive` → **`mocksession_and_lectures`**.
18 references across 10 files.

- [x] **One canonical `CourseTier`** now lives in [src/types/api.ts](../src/types/api.ts) and is
      re-exported from `payments.service` for existing callers. Used by `PaymentPlan.tier`,
      `Subscription.tier`, `Enrollment.accessTier`, `EnrollmentCheck.accessTier`,
      `CourseAccess.tier`. The three *record* fields are typed `CourseTier | string` — the backend
      migration may not have landed for every row, and a stale value should render, not fail to
      compile.
- [x] **New shared module [src/lib/tiers.ts](../src/lib/tiers.ts)** — `TIER_LABEL`, `tierLabel()`
      (falls back to the raw value), `includesLectures()`, `TIER_ORDER`, `byTierOrder()`.
      Replaced **four separately-maintained label maps** that had already drifted
      ("PDF only" vs "PDF Only").
- [x] Label call sites migrated to `tierLabel()` —
      [MyCoursesList.tsx](../src/components/shared/MyCoursesList.tsx),
      [Subscriptioncard.tsx](<../src/app/(marketplace)/subscriptions/_components/Subscriptioncard.tsx>),
      [courses/[id]/page.tsx](<../src/app/(marketplace)/courses/[id]/page.tsx>),
      [EnrollmentDetailModal.tsx](<../src/app/(admin)/admin-enrollments/_components/EnrollmentDetailModal.tsx>)
- [x] Behaviour gates now use `includesLectures()` instead of comparing to a literal —
      [content/[lessonId]/route.ts](<../src/app/api/courses/[id]/content/[lessonId]/route.ts>)
      (with a `TODO(Phase 6)` noting `type` is file format, not what the tier buys) and
      `canWatchVideo` in [my-courses/[id]/page.tsx](<../src/app/(marketplace)/my-courses/[id]/page.tsx>)
- [x] `CoursePurchase` uses `CourseTier` + `byTierOrder()`; its sort was a buggy
      single-argument comparator (`.sort((a) => …)`, ignoring `b`) — now a real comparator
- [x] `Subscription.courseId` typed `| null` too (same deleted-course hazard as enrollments)
- [x] Grep confirms **no `pdf_only`/`pdf_drive` left in code** — only in migration comments
- [x] `npx tsc --noEmit` clean; `npx eslint src` clean apart from 2 pre-existing warnings in
      `DifferentMockCases.tsx` (unrelated)
- [x] ~~Keep old keys in the label maps~~ — **not needed** (Q4: backend is migrating; new names
      only). Existing `TIER_LABEL[x] ?? x` fallbacks mean a stale record shows readable text.

Display labels per the guide: **Mock Sessions Only** / **Mock Sessions + Lectures**.

### Test
- [ ] `/my-courses` card badge renders a label, not a raw enum
- [ ] `/subscriptions` card tier label
- [ ] Admin enrollment detail modal tier label
- [ ] An enrollment with legacy `pdf_drive` still shows a friendly label

---

## Phase 3 — Course pricing display + checkout

**Pricing rule reversed.** CLAUDE.md §8 says *"Pricing is GLOBAL by tier, keyed to
`stripePriceId`, NOT `Course.price`"*. Now course plans return **`prices: []`** and amounts come
from the course's own `priceMonthly`/`priceQuarterly`.

Concrete break: [CoursePurchase.tsx](<../src/app/(marketplace)/courses/[id]/_components/CoursePurchase.tsx>)
builds intervals and labels from `plan.prices`. With empty arrays it renders two tier cards showing
`—` and the Subscribe button is **permanently disabled** (`disabled={pending || !selectedPrice}`,
line 142) — it won't even hit the "Plans are unavailable" branch, because the plan groups still exist.

- [x] Intervals + amounts now come from `course.priceMonthly`/`priceQuarterly` via
      `availableIntervals()` / `priceForInterval()`, not `plan.prices` —
      [CoursePurchase.tsx](<../src/app/(marketplace)/courses/[id]/_components/CoursePurchase.tsx>)
      (takes the whole `course` now, not just `courseId`)
- [x] An interval the course doesn't price is **not rendered**, so checkout can't be called
      with an unsupported one (backend `400`)
- [x] Subscribe is no longer permanently disabled — it gated on `plan.prices` being non-empty,
      which is now always empty for courses. Disabled only while a request is in flight.
- [x] Tier **name/description** still read from `/payments/plans`, with a hardcoded fallback so a
      failed/empty plans fetch can't hide the buy button entirely
- [x] Prices formatted as **pounds** via `formatMoney` (no ÷100 — that's only for
      `PlanPrice.amount` and payment history)
- [x] "No price on either interval" renders an explanatory message instead of a dead button
- [x] Response parsing tightened to the confirmed `{ sessionId, url }`; the speculative
      `checkoutUrl`/`sessionUrl` fallbacks and the temporary raw-response probe log are gone
- [x] Documented failures mapped to human copy: `409` → toast with a **Manage** action linking to
      `/subscriptions`; `404` → "no longer available"; network vs HTTP distinguished
- [x] **Extracted [src/lib/checkout.ts](../src/lib/checkout.ts) `runCheckout()`** — the course and
      Case Bank actions were ~60 near-identical lines each (same URL guessing, same error
      handling, same `getOrigin`). Both are now thin wrappers; the Case Bank flow picked up the
      tightened parsing and 409/404 handling for free instead of keeping the old dead fallbacks.
- [x] Course card price display — [CoursesCard.tsx](<../src/app/(marketplace)/courses/_components/CoursesCard.tsx>)
      (done in Phase 1, incl. the "Free" bug)
- [x] `npx tsc --noEmit` clean; `npx eslint src` clean apart from the 2 pre-existing warnings

### Test — 2026-08-07

- [x] Course with both prices → Monthly/Quarterly toggle shown; cards + button read
      `£49.99 / month`, switching to `£129.99 / quarter`
- [x] Tier cards show the new names ("Course — Mock Sessions Only" / "… + Lectures")
- [x] Subscribe enabled and **reaches the Stripe hosted page**
- [ ] Course with only monthly → quarterly hidden *(not retested after the pricing rewrite)*
- [ ] Second checkout for the same course → `409` + "Manage" toast *(needs an active sub)*
- [ ] Completing a payment — **blocked on Q3** (live Stripe; don't enter real cards)

**Bug I introduced and fixed during this phase:** extracting `runCheckout` left
`export type { CheckoutActionResult }` in both `"use server"` files. A server-action module
re-exports every name at *runtime*, so a type-only re-export becomes a reference to something
that doesn't exist — `ReferenceError: CheckoutActionResult is not defined` on **module
evaluation**, which took down the whole course page, not just the button. Removed, with a warning
comment in both files, and scanned every `"use server"` file for the same pattern (none left).
Rule: **a `"use server"` file may only export async functions.**

---

## Phase 4 — Richer subscription/status responses

Status endpoints now return more than `{ active }`.

- [x] `CourseSubStatus` / `CaseBankStatus` carry `tier`, `currentPeriodEnd`,
      `cancelAtPeriodEnd`, `billingInterval`. Kept as one interface with optional fields rather
      than the doc's discriminated union — the extras are absent from the `{active:false}` form,
      so optionality models it without forcing narrowing at every call site.
- [x] New `SubscriptionStatus` type (widened with `string` — Stripe reports states beyond the
      four documented); `Subscription.status` now uses it
- [x] **New [src/lib/subscription-status.ts](../src/lib/subscription-status.ts)** — `statusMeta()`
      (label + tone + notice), `grantsAccess()` (**`past_due` returns true**), `needsAttention()`.
      Handles Stripe's `canceled` *and* `cancelled` spellings, and unknown states degrade to a
      de-underscored label rather than raw enum text.
- [x] `past_due` now reads as **amber "Payment due"** with "update your card to keep access",
      instead of the old grey badge showing raw `past_due` — which implied the user was locked out
      when they still have access
- [x] Page-level banner on `/subscriptions` when any subscription needs attention, with an
      **Update payment** button straight into the billing portal —
      [SubscriptionsBrowser.tsx](<../src/app/(marketplace)/subscriptions/_components/SubscriptionsBrowser.tsx>)
- [x] `cancelAtPeriodEnd` → **"Access until {date}"** rather than "Cancels on" (clearer that
      access continues)
- [x] [access.ts](../src/lib/access.ts) rewritten: prefers the subscription's `tier` and falls
      back to the enrollment's (an admin grant has no subscription); also returns `via`
      (`subscription` | `enrollment`) and the billing fields
- [x] Course detail page shows "Renews {date}" / "Access until {date}" next to the access badge
- [x] **Extracted [src/lib/date.ts](../src/lib/date.ts) `formatDate`** — was a local helper in
      `Subscriptioncard`; deliberately UTC, since these render server-side and a
      locale-dependent format causes hydration mismatch
- [ ] `EnrollmentCheck` left as optional fields (same reasoning as the status types)
- [x] `npx tsc --noEmit` clean; `npx eslint src` clean apart from the 2 pre-existing warnings

### Test
- [ ] Subscribed user sees tier + renewal date on the course page and subscription card
- [ ] Unsubscribed user still correctly gated
- [ ] `past_due` shows the amber badge, card notice, and page banner — **needs backend to put a
      subscription into `past_due`**, so untestable for now

---

## Phase 5 — Post-checkout polling

Access is granted by **webhook**, 1–3s after redirect. `/payment/success` is currently static
([payment/success/page.tsx](<../src/app/(marketplace)/payment/success/page.tsx>)) — it tells the
user to wait but never re-checks.

- [x] `successUrl` now carries the purchase context (`?type=…&courseId=…`) plus Stripe's literal
      `&session_id={CHECKOUT_SESSION_ID}` — appended by hand, since `URLSearchParams` would
      escape the braces and break Stripe's substitution — [lib/checkout.ts](../src/lib/checkout.ts)
- [x] New server action `checkPurchaseActive(type, courseId)` —
      [payment/success/actions.ts](<../src/app/(marketplace)/payment/success/actions.ts>).
      For a course it accepts **either** an active subscription **or** an enrollment (the webhook
      writes both; whichever lands first means access). A failed poll returns "not yet" rather
      than erroring, so a blip doesn't look like a failed purchase.
- [x] New client component
      [ActivationStatus.tsx](<../src/app/(marketplace)/payment/success/_components/ActivationStatus.tsx>)
      — polls 10× at 1.5s with a visible `(n/10)` counter; three states:
      **waiting** (spinner) → **active** ("You're all set" + Go to course / Explore Case Bank)
      or **timeout** (amber, "payment went through, access is slow", **Check again** button)
- [x] Timeout copy deliberately reassuring — the payment *has* succeeded at that point, so it
      must not read as a failure
- [x] Course success mentions the Drive materials + "check your email", per the backend's guidance
- [x] `/payment/success` is now a server page reading `searchParams`, wrapping the client poller
- [ ] Backend's default cancel URL is `/payment/cancelled`; ours is `/payment/cancel`. We always
      send `cancelUrl` explicitly, so it's fine — but an alias route would be belt-and-braces.
- [x] `npx tsc --noEmit` + `npx eslint src` clean

**Two lint findings fixed properly rather than suppressed blindly:** the first draft called
`setState` synchronously inside the effect (cascading renders) — restructured so the first status
check is awaited before any state update. It also read `ref.current` in the effect cleanup, which
can see a changed value; now each run gets a local `{ cancelled }` token that the cleanup closes
over. The remaining single suppression is justified in a comment (the rule can't see that the
`setState` calls are in async continuations). Note for future: `eslint-disable-next-line` applies
to the *immediately* following line — a multi-line reason after the directive silently disables
nothing.

### Test — needs Stripe test mode (Q3)
- [ ] Complete a checkout → page flips to "You're all set" with no manual refresh
- [ ] Cancel at Stripe → lands on our cancel page, no subscription created
- [ ] Timeout path → visible after ~15s if the webhook never lands

---

## Phase 6 — Course content: keep lessons, add lecture / work session

**Resolved (Q2):** PDF lessons and Google Drive links both stay. The in-app viewer, the
access-checked proxy, and `/my-courses/[id]/[lessonId]` all survive — **no deletions.**

New work — admins can upload **lectures** and **work sessions**:

- [ ] Admin Course Content: add a category choice (lecture / work session) alongside the existing
      PDF-upload and Drive-link flows —
      [admin-courses/[id]/content](<../src/app/(admin)/admin-courses/[id]/content>)
- [!] **Depends on Q9** — no backend field exists to store the category yet (`type` is
      `pdf`/`video`, i.e. file format). Until backend adds one, the distinction can't persist and
      tier gating can't use it.
- [ ] Once the field exists: gate content by tier — `mocksessions_only` sees work sessions only,
      `mocksession_and_lectures` sees both. Replaces the current
      "video requires the higher tier" rule in
      [content/[lessonId]/route.ts:37-38](<../src/app/api/courses/[id]/content/[lessonId]/route.ts>)
      and `canWatchVideo` in [my-courses/[id]/page.tsx:58-59](<../src/app/(marketplace)/my-courses/[id]/page.tsx>)
- [!] **In-app PDFs still don't work — Q8.** Private Cloudinary assets return 401 to our proxy.
      Nothing to build here; it's a backend fix. Keeps CLAUDE.md §7 blocker #2 open.

---

## Phase 7 — Case Bank gating — no change needed

**Resolved (Q1):** unsubscribed users get **5 free cases**, enforced backend-side. Current
behaviour (no frontend paywall + the
[CaseBankUpsell](<../src/app/(marketplace)/full-cases/_components/CaseBankUpsell.tsx>) banner) is
correct as built.

- [x] **Verified 2026-08-07** — unsubscribed member sees "All Cases: 5 Cases" plus the
      "You're viewing free cases" upsell banner with **Subscribe — £24.99 / month**. Backend is
      enforcing the limit; no frontend change needed. (Confirms Q1: the guide's "403 without a
      subscription" is wrong.)

---

## Phase 8 — Smaller items

- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local` (live key; rotate later). **Currently
      unused** — we use the guide's Option A (redirect to `data.url`), which needs no Stripe.js.
- [ ] `GET /courses/:id` is now **public** (was auth + published-only) — check whether anything
      relies on it 401ing
- [ ] `/payments/me` is **paginated** (`{items,total,page,limit,totalPages}`) with amounts in
      **pence** — [payments.service.ts](../src/services/payments.service.ts) `getMyPayments` is
      still typed/unused; wire it into a billing history view or leave documented
- [ ] Billing portal takes `returnUrl` and `404`s when the user has no subscription — confirm we
      send it and handle the 404
- [ ] Replace [docs/nativemed-api.postman_collection.json](nativemed-api.postman_collection.json)
      with the new export (the current one predates all of this)

---

## Phase 9 — Update CLAUDE.md (do last, after each phase settles)

- [ ] §0 module table: new `POST /courses` body; tier enum values; `GET /courses/:id` public
- [ ] §7 blockers: Stripe dummy-price blocker → resolved; PDF blocker → re-scope per Q2
- [ ] §8: `Course` shape (`priceMonthly`/`priceQuarterly`), plan `prices: []` for courses, and
      **reverse** the "pricing is GLOBAL by tier" note
- [ ] §8: document that `/enrollments/me` `courseId` is **nullable** when the course was deleted
      (cost us a debugging session — see [MyCoursesList.tsx](../src/components/shared/MyCoursesList.tsx))
- [ ] §7 mental model: tier names in the Subscription-vs-Enrollment section

---

## Regression checklist (run after Phases 1–5)

- [ ] Login → member dashboard; login as admin → admin dashboard
- [ ] `/courses` list + detail render prices correctly
- [ ] `/my-courses` — cards for real access, correct empty/unavailable states
- [ ] `/subscriptions` — cards + Manage billing
- [ ] `/full-cases` — grid, specialty, case detail, prev/next
- [ ] Admin: casebank list + create/edit/publish, courses list + create/edit/publish/thumbnail,
      users, subscribers, enrollments (grant/revoke/restore)
- [ ] `npx tsc --noEmit` and `npx eslint src` clean
