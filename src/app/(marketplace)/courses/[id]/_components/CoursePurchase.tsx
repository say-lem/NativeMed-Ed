"use client";
import { useMemo, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCourseCheckout } from "../actions";
import type { PaymentPlan, PlanPrice } from "@/types/api";

type Tier = "pdf_only" | "pdf_drive";

const INTERVAL_LABEL: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
};

function priceFor(
  plan: PaymentPlan,
  interval: string,
): PlanPrice | undefined {
  return plan.prices.find((p) => p.interval === interval);
}

export default function CoursePurchase({
  courseId,
  plans,
}: {
  courseId: string;
  plans: PaymentPlan[];
}) {
  const coursePlans = useMemo(
    () =>
      plans
        .filter((p) => p.type === "course" && p.tier)
        .sort((a) => (a.tier === "pdf_only" ? -1 : 1)),
    [plans],
  );

  // Distinct intervals available across the course plans (monthly, quarterly, …).
  const intervals = useMemo(() => {
    const set = new Set<string>();
    coursePlans.forEach((p) => p.prices.forEach((pr) => set.add(pr.interval)));
    return Array.from(set);
  }, [coursePlans]);

  const [interval, setInterval] = useState<string>(intervals[0] ?? "monthly");
  const [tier, setTier] = useState<Tier>(
    (coursePlans[0]?.tier as Tier) ?? "pdf_only",
  );
  const [pending, startTransition] = useTransition();

  if (coursePlans.length === 0) {
    return (
      <p className="text-sm text-subtle-text">
        Plans are unavailable right now. Please try again in a moment.
      </p>
    );
  }

  const selectedPlan = coursePlans.find((p) => p.tier === tier);
  const selectedPrice = selectedPlan
    ? priceFor(selectedPlan, interval)
    : undefined;

  const subscribe = () => {
    startTransition(async () => {
      const res = await startCourseCheckout(courseId, tier, interval);
      if (res.ok && res.url) {
        window.location.assign(res.url);
      } else {
        toast.error(res.message ?? "Couldn't start checkout.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Interval toggle */}
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

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coursePlans.map((plan) => {
          const price = priceFor(plan, interval);
          const active = plan.tier === tier;
          return (
            <button
              key={plan.tier}
              type="button"
              onClick={() => setTier(plan.tier as Tier)}
              className={`text-left rounded-[16px] border p-5 transition-all ${
                active
                  ? "border-primary-100 ring-1 ring-primary-100 bg-primary-10"
                  : "border-gray-1 hover:border-black-others"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-base text-black-others">
                  {plan.name}
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
                {price?.label ?? "—"}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-[150%] text-subtle-text">
                {plan.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Subscribe */}
      <Button
        type="button"
        onClick={subscribe}
        disabled={pending || !selectedPrice}
        className="w-full sm:w-auto font-bold text-sm sm:text-base bg-black-others disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {selectedPrice ? `Subscribe — ${selectedPrice.label}` : "Subscribe"}
      </Button>
    </div>
  );
}
