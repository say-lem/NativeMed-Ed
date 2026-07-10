"use client";
import { useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCaseBankCheckout } from "../actions";

/** Shown on the Case Bank when the user isn't subscribed: they see the free
 *  cases the backend returns; this nudges them to unlock the rest. */
export default function CaseBankUpsell({
  priceLabel,
}: {
  priceLabel?: string;
}) {
  const [pending, startTransition] = useTransition();

  const subscribe = () => {
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
          <p className="font-semibold text-black-others">
            You&apos;re viewing free cases
          </p>
          <p className="text-sm text-subtle-text">
            Subscribe to the Case Bank to unlock every case.
          </p>
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
