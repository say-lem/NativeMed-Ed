"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCourseCheckout } from "../actions";
import { byTierOrder, TIER_LABEL } from "@/lib/tiers";
import {
  formatMoney,
  INTERVAL_LONG,
  intervalsForTier,
  priceFor,
  purchasableTiers,
} from "@/lib/price";
import type { Course, CourseTier, PaymentPlan } from "@/types/api";

const INTERVAL_LABEL: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
};

/** Fallback copy if `/payments/plans` is unavailable — tier names shouldn't block buying. */
const TIER_FALLBACK_DESCRIPTION: Record<CourseTier, string> = {
  mocksessions_only: "Access to mock session materials on Google Drive.",
  mocksession_and_lectures:
    "Access to mock sessions and lecture materials on Google Drive.",
};

export default function CoursePurchase({
  course,
  plans,
  contactEmail,
}: {
  course: Course;
  plans: PaymentPlan[];
  contactEmail: string | null;
}) {
  /**
   * Tier name/description come from `/payments/plans` (course plans return `prices: []`),
   * but **prices come from the course** — `pricing[tier][interval]`, per tier since
   * 2026-08-10. Only tiers the course actually prices are offered: migrated courses often
   * have just `mocksession_and_lectures`, and showing an unbuyable tier would 400 at
   * checkout. Falls back to the known tier labels if the plans fetch fails.
   */
  const tiers = useMemo(() => {
    const sellable = purchasableTiers(course);

    const described = plans
      .filter((p) => p.type === "course" && p.tier)
      .sort((a, b) => byTierOrder(a.tier, b.tier));

    return sellable.map((t) => {
      const plan = described.find((p) => p.tier === t);
      return {
        tier: t,
        name: plan?.name ?? TIER_LABEL[t],
        description: plan?.description ?? TIER_FALLBACK_DESCRIPTION[t],
      };
    });
  }, [course, plans]);

  const [tier, setTier] = useState<CourseTier>(
    () => purchasableTiers(course)[0] ?? "mocksession_and_lectures",
  );

  // Intervals are scoped to the SELECTED tier — a tier may be monthly-only.
  const intervals = useMemo(() => intervalsForTier(course, tier), [course, tier]);
  const [interval, setInterval] = useState<string>(
    () => intervalsForTier(course, tier)[0] ?? "monthly",
  );

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Switching tier can invalidate the chosen interval (e.g. quarterly exists on one tier
  // only) — fall back to that tier's first available interval.
  const activeInterval = intervals.includes(interval)
    ? interval
    : (intervals[0] ?? interval);

  const amount = priceFor(course, tier, activeInterval);
  const priceLabel =
    amount != null
      ? `${formatMoney(amount)} / ${INTERVAL_LONG[activeInterval] ?? activeInterval}`
      : null;

  const subscribe = () => {
    startTransition(async () => {
      const res = await startCourseCheckout(course._id, tier, activeInterval);
      if (res.ok && res.url) {
        window.location.assign(res.url);
        return;
      }
      // 409: they're already subscribed — point at billing rather than repeating the error.
      if (res.alreadySubscribed) {
        toast.error(res.message ?? "You're already subscribed.", {
          action: {
            label: "Manage",
            onClick: () => router.push("/subscriptions"),
          },
        });
        return;
      }
      toast.error(res.message ?? "Couldn't start checkout.");
    });
  };

  // Admin has paused new checkouts/plan changes for this course. Existing subscribers keep
  // access — this only blocks someone new from clicking through to pay.
  if (course.paymentsPaused) {
    return (
      <div className="flex items-start gap-3 rounded-[16px] border border-[#FFC9C9] bg-[#FFF5F5] p-5">
        <MailWarning size={20} className="text-[#C11616] shrink-0 mt-0.5" />
        <p className="text-sm sm:text-base leading-[150%] text-[#7A1010]">
          Payment is not available at this time for this course. Please contact admin team
          for more info
          {contactEmail && (
            <>
              <br />
              email:{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold underline">
                {contactEmail}
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  // No tier has a price — the course isn't buyable. Real case: legacy courses came through
  // the 2026-08-10 migration with no `pricing` object at all.
  if (tiers.length === 0) {
    return (
      <p className="text-sm text-subtle-text">
        This course isn&apos;t available for purchase yet. Please check back
        soon.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interval toggle — scoped to the selected tier, shown only if that tier has both */}
      {intervals.length > 1 && (
        <div className="inline-flex rounded-[10px] border border-gray-1 p-1 bg-white">
          {intervals.map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setInterval(iv)}
              className={`px-4 py-2 rounded-[8px] text-sm font-medium capitalize transition-colors ${
                activeInterval === iv
                  ? "bg-black-others text-white"
                  : "text-subtle-text hover:text-black-others"
              }`}
            >
              {INTERVAL_LABEL[iv] ?? iv}
            </button>
          ))}
        </div>
      )}

      {/* Tier cards — each shows ITS OWN price, which is the point of per-tier pricing.
          A tier priced on a different interval than the one selected falls back to its
          own cheapest available one, so a card never renders blank. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiers.map((t) => {
          const active = t.tier === tier;
          const tierIntervals = intervalsForTier(course, t.tier);
          const shownInterval = tierIntervals.includes(activeInterval)
            ? activeInterval
            : tierIntervals[0];
          const tierAmount = shownInterval
            ? priceFor(course, t.tier, shownInterval)
            : undefined;
          const tierLabelPrice =
            tierAmount != null && shownInterval
              ? `${formatMoney(tierAmount)} / ${INTERVAL_LONG[shownInterval] ?? shownInterval}`
              : "—";
          return (
            <button
              key={t.tier}
              type="button"
              onClick={() => setTier(t.tier)}
              className={`text-left rounded-[16px] border p-5 transition-all ${
                active
                  ? "border-primary-100 ring-1 ring-primary-100 bg-primary-10"
                  : "border-gray-1 hover:border-black-others"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-base text-black-others">
                  {t.name}
                </span>
                <span
                  className={`grid place-items-center size-5 rounded-full border ${
                    active
                      ? "bg-primary-100 border-primary-100 text-white"
                      : "border-gray-1 text-transparent"
                  }`}
                >
                  <Check size={12} />
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-black-others">
                {tierLabelPrice}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-[150%] text-subtle-text">
                {t.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Subscribe */}
      <Button
        type="button"
        onClick={subscribe}
        disabled={pending}
        className="w-full sm:w-auto font-bold text-sm sm:text-base bg-black-others disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {priceLabel ? `Subscribe — ${priceLabel}` : "Subscribe"}
      </Button>
    </div>
  );
}
