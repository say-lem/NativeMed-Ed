"use client";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCaseBankCheckout } from "@/app/(marketplace)/full-cases/actions";

export default function CaseBankActions({
  hasAccess,
  isLoggedIn,
  priceLabel,
}: {
  hasAccess: boolean;
  isLoggedIn: boolean;
  priceLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const subscribe = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/products/case-bank");
      return;
    }
    startTransition(async () => {
      const res = await startCaseBankCheckout("monthly", window.location.origin);
      if (res.ok && res.url) {
        window.location.assign(res.url);
      } else {
        toast.error(res.message ?? "Couldn't start checkout.");
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
      {hasAccess ? (
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button className="font-bold text-sm sm:text-base bg-black-others w-full">
            Go to dashboard
          </Button>
        </Link>
      ) : (
        <Button
          type="button"
          onClick={subscribe}
          disabled={pending}
          className="font-bold text-sm sm:text-base bg-black-others w-full sm:w-auto disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {priceLabel ? `Subscribe — ${priceLabel}` : "Subscribe"}
        </Button>
      )}
      <Link href="/free-cases" className="w-full sm:w-auto">
        <Button
          variant="outline"
          className="font-bold text-sm sm:text-base border-black-others text-black-others w-full"
        >
          See free cases
        </Button>
      </Link>
    </div>
  );
}
