import axios from "axios";
import Link from "next/link";
import { getMySubscriptions } from "@/services/subscriptions.service";

/** Count of the user's subscriptions; null on error. */
async function loadCount(): Promise<number | null> {
  try {
    const res = await getMySubscriptions();
    if (!res.success) return 0;
    return Array.isArray(res.data) ? res.data.length : 0;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[dashboard/subscriptions] fetch error:", err.code);
    return null;
  }
}

export default async function SubscriptionsSection() {
  const count = await loadCount();

  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
          Subscriptions
        </h2>
        <Link
          href="/subscriptions"
          className="text-sm font-medium text-primary-100 hover:underline shrink-0"
        >
          Manage
        </Link>
      </div>

      {count && count > 0 ? (
        <p className="text-sm text-subtle-text">
          You have {count} active subscription{count === 1 ? "" : "s"}.{" "}
          <Link
            href="/subscriptions"
            className="text-primary-100 font-medium hover:underline"
          >
            View
          </Link>
        </p>
      ) : (
        <div className="rounded-[12px] border border-gray-1 bg-white p-6 text-center text-subtle-text">
          You have no active subscriptions yet.{" "}
          <Link
            href="/full-cases"
            className="text-primary-100 font-medium hover:underline"
          >
            Explore the Case Bank
          </Link>
        </div>
      )}
    </section>
  );
}
