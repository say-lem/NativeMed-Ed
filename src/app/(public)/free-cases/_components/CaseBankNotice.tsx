"use client";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCaseBankCheckout } from "@/app/(marketplace)/full-cases/actions";

/**
 * Top-of-page notice on the public free-cases preview. Two states:
 * - No full access (anonymous, or logged in but not subscribed) — nudge to subscribe.
 * - Full access (subscribed, or admin) — the backend already serves them every case
 *   right here, but point them at the full dashboard experience instead.
 */
export default function CaseBankNotice({
  hasAccess,
  isLoggedIn,
  priceLabel,
}: {
  hasAccess: boolean;
  /** Checkout requires auth — an anonymous visitor is sent to login first rather
   *  than hitting a 401 from the checkout endpoint. */
  isLoggedIn: boolean;
  priceLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (hasAccess) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-10 mt-6 rounded-[12px] border border-primary-100/30 bg-primary-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start sm:items-center gap-3">
          <span className="grid place-items-center size-9 rounded-full bg-primary-100 text-white shrink-0">
            <LayoutDashboard size={18} />
          </span>
          <div>
            <p className="font-semibold text-black-others">You have Case Bank access</p>
            <p className="text-sm text-subtle-text">
              Go to dashboard to access the rest of the cases.
            </p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button className="font-bold bg-black-others shrink-0">Go to dashboard</Button>
        </Link>
      </div>
    );
  }

  const subscribe = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/free-cases");
      return;
    }
    startTransition(async () => {
      const res = await startCaseBankCheckout();
      if (res.ok && res.url) {
        window.location.assign(res.url);
      } else {
        toast.error(res.message ?? "Couldn't start checkout.");
      }
    });
  };

  return (
    <div className="mx-4 sm:mx-6 lg:mx-10 mt-6 rounded-[12px] border border-primary-100/30 bg-primary-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-start sm:items-center gap-3">
        <span className="grid place-items-center size-9 rounded-full bg-primary-100 text-white shrink-0">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="font-semibold text-black-others">You&apos;re viewing free cases</p>
          <p className="text-sm text-subtle-text">Subscribe to access full cases.</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={subscribe}
        disabled={pending}
        className="font-bold bg-black-others shrink-0 disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {priceLabel ? `Subscribe — ${priceLabel}` : "Subscribe"}
      </Button>
    </div>
  );
}
