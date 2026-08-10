# Demo run-through — 2026-08-10

Run top to bottom, as if demoing. Each step says what you should see. Stop and flag anything
that doesn't match.

## ⛔ Do NOT demo these (known broken / risky)

- **Opening a PDF lesson** — the file won't load. Cloudinary returns 401 to our server;
  unresolved backend issue.
- **Completing a Stripe payment** — backend is on **LIVE** keys. Reaching the Stripe page is
  fine; entering card details charges a real card.
- **Deleting a real course** — delete now cascades: it unenrolls every user and cancels their
  Stripe subscriptions. Only delete a throwaway test course.

---

## Part A — Admin

- [ ] **1. Log in** as `admin@nativemed.com` → lands on **/admin-dashboard** with stat numbers
      (not zeros/blank).
- [ ] **2. Admin → Courses** → **7 courses**, each showing both tiers:
      `Sessions: £69.99/mo, £199.00/qtr · +Lectures: £99.99/mo, £289.00/qtr`
- [ ] **3. Click Edit** on any course → **all four price boxes filled** (69.99 / 199 / 99.99 /
      289) and **both Drive link boxes filled** with a folder ID. *(New — they used to be blank.)*
- [ ] **4. Change only the title**, save → succeeds, no Drive/price complaints; list shows the new
      title with prices unchanged.
- [ ] **5. Create a course** — title, description, all four prices, both Drive folder links →
      **Publish Now** → saves and appears in the list with correct prices.
- [ ] **6. Validation** — new course, clear both "Mock Sessions Only" prices → blocked with
      *"Set a monthly or quarterly price for Mock Sessions Only"*, no network request.
- [ ] **7. Delete warning** — click the bin on your throwaway test course → dialog reads
      *"This immediately revokes access for all enrolled users and cancels their subscriptions…"*
      → **Cancel** (or confirm only on a test course).
- [ ] **8. Admin → Case Bank** → list loads, All/Published/Draft tabs with counts, search works.
- [ ] **9. Admin → Subscribers / Users / Enrollments** → each loads without error.
- [ ] **10. Log out** → back to login.

## Part B — Member

- [ ] **11. Log in** as the member account → lands on **/dashboard** with stats + sections.
- [ ] **12. Courses** → cards show **"from £69.99/mo"** (cheapest of the four prices).
- [ ] **13. Open a course** → "Choose your plan" shows **two tier cards with DIFFERENT prices**:
      Mock Sessions Only **£69.99 / month**, Mock Sessions + Lectures **£99.99 / month**.
      *(This is the headline change — tiers used to cost the same.)*
- [ ] **14. Click Quarterly** → prices become **£199.00 / quarter** and **£289.00 / quarter**;
      the Subscribe button label follows the selected tier.
- [ ] **15. Select the other tier** → the Subscribe button price switches to match it.
- [ ] **16. Click Subscribe** → Stripe hosted page loads → **stop there, go back.**
- [ ] **17. Case Bank** → "All Cases: 5 Cases" + the *"You're viewing free cases"* banner with
      **Subscribe — £24.99 / month**.
- [ ] **18. Open a specialty → open a case** → full case renders: patient data, blood tests
      (abnormal rows highlighted), section tabs, Previous/Next.
- [ ] **19. My Courses** → either your courses, or *"Your courses aren't available"* if the 3
      broken enrollments are still in the DB. Should **never** be a blank white area.
- [ ] **20. Subscriptions** → cards, or the "No active subscriptions" empty state.
- [ ] **21. Settings** → profile prefilled; password + logout-all present.
- [ ] **22. Public site** (log out) → home + products load with real courses.

---

## Open with backend (not fixable our side)

1. Are £69.99/£199/£99.99/£289 the **real** prices? Identical across all 7 courses — looks like
   a blanket backfill.
2. **Stripe test mode** — needed to demo an actual purchase.
3. **Lecture vs work-session category** — no field exists, so tier gating of content can't work.
4. **Course PDFs** — Cloudinary 401, still broken.
5. Were the 3 orphaned enrollments (`courseId: null`) cleaned up?
