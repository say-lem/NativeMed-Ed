"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkPurchaseActive } from "../actions";

const MAX_ATTEMPTS = 10;
const INTERVAL_MS = 1500;

type State = "waiting" | "active" | "timeout";

export default function ActivationStatus({
  type,
  courseId,
  sessionId,
}: {
  type: string;
  courseId?: string;
  sessionId?: string;
}) {
  const [state, setState] = useState<State>("waiting");
  const [attempt, setAttempt] = useState(0);
  /** Token for the in-flight loop, so a retry or unmount can invalidate it. */
  const activeRun = useRef<{ cancelled: boolean } | null>(null);

  /**
   * Awaits the first status check BEFORE touching state — calling setState synchronously
   * from an effect body triggers cascading renders (and React's lint rule flags it).
   */
  const runPolling = useCallback(
    async (run: { cancelled: boolean }) => {
      for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        const res = await checkPurchaseActive(type, courseId, sessionId);
        if (run.cancelled) return;

        setAttempt(i);
        if (res.active) {
          setState("active");
          return;
        }
        if (i < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, INTERVAL_MS));
          if (run.cancelled) return;
        }
      }
      setState("timeout");
    },
    [type, courseId, sessionId],
  );

  useEffect(() => {
    // Local token (not `ref.current`) so cleanup can't read a value that has since changed.
    const run = { cancelled: false };
    activeRun.current = run;
    // This IS an effect's intended use: subscribing to external state (the Stripe
    // webhook's progress) and updating React from the responses. Every setState inside
    // runPolling runs in an async continuation after an await — never synchronously
    // during this render — but the rule can't see through the function boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runPolling(run);
    return () => {
      run.cancelled = true;
    };
  }, [runPolling]);

  const retry = () => {
    if (activeRun.current) activeRun.current.cancelled = true;
    const run = { cancelled: false };
    activeRun.current = run;
    setState("waiting");
    setAttempt(0);
    void runPolling(run);
  };

  const isCourse = type === "course" && Boolean(courseId);
  const isBooking = type === "booking";
  const destination = isCourse
    ? `/my-courses/${courseId}`
    : isBooking
      ? "/one-on-one"
      : "/full-cases";
  const destinationLabel = isCourse
    ? "Go to course"
    : isBooking
      ? "My bookings"
      : "Explore Case Bank";
  // Booking isn't a subscription, so the secondary CTA elsewhere in this component
  // points somewhere relevant instead of "My subscriptions".
  const secondaryHref = isBooking ? "/dashboard" : "/subscriptions";
  const secondaryLabel = isBooking ? "Dashboard" : "My subscriptions";

  if (state === "waiting") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <Loader2 className="size-14 animate-spin text-primary-100" />
        <h1 className="font-semibold text-2xl sm:text-3xl text-black-others">
          Payment received
        </h1>
        <p className="max-w-md text-sm sm:text-base text-subtle-text leading-[150%]">
          We&apos;re activating your access now — this usually takes a few
          seconds. Please keep this page open.
        </p>
        <p className="text-xs text-subtle-text">
          Checking… ({attempt}/{MAX_ATTEMPTS})
        </p>
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <CheckCircle2 className="size-16 text-green-500" />
        <h1 className="font-semibold text-2xl sm:text-3xl text-black-others">
          You&apos;re all set
        </h1>
        <p className="max-w-md text-sm sm:text-base text-subtle-text leading-[150%]">
          {isBooking
            ? "Your session is booked and confirmed — we'll be in touch with the details."
            : "Your access is active."}{" "}
          {isCourse &&
            "Course materials are shared to your Google Drive — check your email if you don't see them yet."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href={destination}>
            <Button className="font-bold bg-black-others">
              {destinationLabel}
            </Button>
          </Link>
          <Link href={secondaryHref}>
            <Button
              variant="outline"
              className="font-bold border-black-others text-black-others"
            >
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Timed out — the payment almost certainly succeeded, so don't alarm the user.
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <TriangleAlert className="size-14 text-amber-500" />
      <h1 className="font-semibold text-2xl sm:text-3xl text-black-others">
        Payment received
      </h1>
      <p className="max-w-md text-sm sm:text-base text-subtle-text leading-[150%]">
        Your payment went through, but access is taking longer than usual to
        activate. It often lands a moment later — try checking again, and
        contact support if it still doesn&apos;t appear.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Button
          type="button"
          onClick={retry}
          className="font-bold bg-black-others"
        >
          Check again
        </Button>
        <Link href={secondaryHref}>
          <Button
            variant="outline"
            className="font-bold border-black-others text-black-others"
          >
            {secondaryLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
