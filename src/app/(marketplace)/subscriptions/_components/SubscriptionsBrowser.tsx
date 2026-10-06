"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import SearchBanner from "@/components/shared/SearchBanner";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "./Subscriptioncard";
import { openBillingPortal } from "../actions";
import { needsAttention } from "@/lib/subscription-status";
import type { Subscription } from "@/types/api";

function subTitle(s: Subscription): string {
  return s.type === "course"
    ? s.courseId?.title ?? "course"
    : "Case Bank Access";
}

export default function SubscriptionsBrowser({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  // `past_due` keeps access while Stripe retries, so this is a prompt to fix the card —
  // not a lockout. Surfaced at page level too, since a failing card affects billing overall.
  const attention = useMemo(
    () => needsAttention(subscriptions),
    [subscriptions],
  );

  /**
   * Only offer the billing portal when there's a real Stripe subscription behind it.
   * Admin-granted access still appears here as an active subscription, but has no Stripe
   * customer — the portal can't open for it, so showing the button just produces an error.
   */
  const canManageBilling = useMemo(
    () =>
      subscriptions.some((s) => s.stripeSubscriptionId || s.stripeCustomerId),
    [subscriptions],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter((s) => subTitle(s).toLowerCase().includes(q));
  }, [query, subscriptions]);

  const manage = () => {
    startTransition(async () => {
      const res = await openBillingPortal(window.location.origin);
      if (res.ok && res.url) {
        window.location.assign(res.url);
      } else {
        toast.error(res.message ?? "Couldn't open billing.");
      }
    });
  };

  return (
    <>
      <SearchBanner
        title="Subscriptions"
        placeholder="Search subscriptions..."
        value={query}
        onChange={setQuery}
      />

      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-10 space-y-6">
        {attention.length > 0 && (
          <div className="rounded-[8px] border border-[#F5C26B] bg-[#FFF8EC] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#7A4B00] leading-[150%]">
              <span className="font-semibold">
                {attention.length === 1
                  ? "A payment needs your attention."
                  : `${attention.length} payments need your attention.`}
              </span>{" "}
              You still have access while we retry, but update your card to
              avoid losing it.
            </p>
            {canManageBilling && (
              <Button
                type="button"
                onClick={manage}
                disabled={pending}
                className="font-bold bg-[#7A4B00] hover:opacity-90 disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                Update payment
              </Button>
            )}
          </div>
        )}

        {canManageBilling && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={manage}
              disabled={pending}
              className="font-bold bg-black-others disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Manage billing
            </Button>
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <div className="grid place-items-center size-14 rounded-full bg-primary-10 text-primary-100">
              <CreditCard size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg text-black-others">
                No active subscriptions
              </p>
              <p className="text-sm text-subtle-text max-w-sm">
                Subscribe to the Case Bank or a course and it&apos;ll show up
                here.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/courses">
                <Button className="font-bold bg-black-others">
                  Browse courses
                </Button>
              </Link>
              <Link href="/full-cases">
                <Button
                  variant="outline"
                  className="font-bold border-black-others text-black-others"
                >
                  Explore Case Bank
                </Button>
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-subtle-text py-12">
            No subscriptions match &ldquo;{query.trim()}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((s) => (
              <SubscriptionCard key={s._id} sub={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
