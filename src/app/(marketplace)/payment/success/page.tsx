import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";

export default function PaymentSuccessPage() {
  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Payment" />
      </BannerBg>
      <section className="px-4 sm:px-8 lg:px-15 py-16 sm:py-24 flex flex-col items-center text-center gap-5">
      <CheckCircle2 className="size-16 text-green-500" />
      <h1 className="font-semibold text-2xl sm:text-3xl text-black-others">
        Payment successful
      </h1>
      <p className="max-w-md text-sm sm:text-base text-subtle-text leading-[150%]">
        Thanks for subscribing. Your access is being activated — it may take a
        moment to appear while we confirm the payment.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link href="/courses">
          <Button className="font-bold bg-black-others">Browse courses</Button>
        </Link>
        <Link href="/subscriptions">
          <Button
            variant="outline"
            className="font-bold border-black-others text-black-others"
          >
            My subscriptions
          </Button>
        </Link>
      </div>
      </section>
    </>
  );
}
