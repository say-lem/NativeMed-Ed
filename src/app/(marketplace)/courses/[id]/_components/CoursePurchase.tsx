"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCourseCheckout } from "../actions";
import {
  formatMoney,
  INTERVAL_LONG,
  priceFor,
  purchasableIntervals,
} from "@/lib/price";
import type { Course } from "@/types/api";

const INTERVAL_LABEL: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export default function CoursePurchase({
  course,
  contactEmail,
}: {
  course: Course;
  contactEmail: string | null;
}) {
  const intervals = useMemo(() => purchasableIntervals(course), [course]);
  const [interval, setInterval] = useState<string>(() => intervals[0] ?? "monthly");
  const activeInterval = intervals.includes(interval) ? interval : (intervals[0] ?? interval);

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const amount = priceFor(course, activeInterval);
  const priceLabel =
    amount != null
      ? `${formatMoney(amount)} / ${INTERVAL_LONG[activeInterval] ?? activeInterval}`
      : null;

  const subscribe = () => {
    startTransition(async () => {
      const res = await startCourseCheckout(
        course._id,
        activeInterval,
        window.location.origin,
      );
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

  // No interval has a price — the course isn't buyable.
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
      {/* Interval toggle — shown only when the course offers both */}
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

      {priceLabel && (
        <p className="text-2xl font-bold text-black-others">{priceLabel}</p>
      )}

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
