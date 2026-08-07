"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCourseCheckout } from "../actions";
import { byTierOrder, TIER_LABEL, TIER_ORDER } from "@/lib/tiers";
import {
  availableIntervals,
  formatMoney,
  INTERVAL_LONG,
  priceForInterval,
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
}: {
  course: Course;
  plans: PaymentPlan[];
}) {
  /**
   * Tier name/description still come from `/payments/plans`, but **prices do not** —
   * as of 2026-08-07 course plans return `prices: []` and the amount lives on the course
   * (`priceMonthly`/`priceQuarterly`, in pounds). Falls back to the known tiers so an
   * empty/failed plans fetch can't hide the buy button.
   */
  const tiers = useMemo(() => {
    const fromPlans = plans
      .filter((p) => p.type === "course" && p.tier)
      .sort((a, b) => byTierOrder(a.tier, b.tier));

    if (fromPlans.length > 0) {
      return fromPlans.map((p) => ({
        tier: p.tier as CourseTier,
        name: p.name,
        description: p.description,
      }));
    }

    return TIER_ORDER.map((t) => ({
      tier: t,
      name: TIER_LABEL[t],
      description: TIER_FALLBACK_DESCRIPTION[t],
    }));
  }, [plans]);

  // Only intervals this course actually has a price for — checkout 400s otherwise.
  const intervals = useMemo(() => availableIntervals(course), [course]);

  const [interval, setInterval] = useState<string>(intervals[0] ?? "monthly");
  const [tier, setTier] = useState<CourseTier>(
    tiers[0]?.tier ?? "mocksessions_only",
  );
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const amount = priceForInterval(course, interval);
  const priceLabel =
    amount != null
      ? `${formatMoney(amount)} / ${INTERVAL_LONG[interval] ?? interval}`
      : null;

  const subscribe = () => {
    startTransition(async () => {
      const res = await startCourseCheckout(course._id, tier, interval);
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

  // No price on either interval — the course isn't buyable (backend requires one, so this
  // is a data problem rather than a normal state).
  if (intervals.length === 0) {
    return (
      <p className="text-sm text-subtle-text">
        This course isn&apos;t available for purchase yet. Please check back
        soon.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interval toggle — only shown when the course offers both */}
      {intervals.length > 1 && (
        <div className="inline-flex rounded-[10px] border border-gray-1 p-1 bg-white">
          {intervals.map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setInterval(iv)}
              className={`px-4 py-2 rounded-[8px] text-sm font-medium capitalize transition-colors ${
                interval === iv
                  ? "bg-black-others text-white"
                  : "text-subtle-text hover:text-black-others"
              }`}
            >
              {INTERVAL_LABEL[iv] ?? iv}
            </button>
          ))}
        </div>
      )}

      {/* Tier cards. Price is per-course, so it's the same on both cards — the tier
          changes what you get, not what you pay. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiers.map((t) => {
          const active = t.tier === tier;
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
                {priceLabel ?? "—"}
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
