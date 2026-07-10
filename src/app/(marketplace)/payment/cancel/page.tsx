import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";

export default function PaymentCancelPage() {
  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Payment" />
      </BannerBg>
      <section className="px-4 sm:px-8 lg:px-15 py-16 sm:py-24 flex flex-col items-center text-center gap-5">
      <XCircle className="size-16 text-red-500" />
      <h1 className="font-semibold text-2xl sm:text-3xl text-black-others">
        Payment cancelled
      </h1>
      <p className="max-w-md text-sm sm:text-base text-subtle-text leading-[150%]">
        No charge was made. You can pick a plan and try again whenever you&apos;re
        ready.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link href="/courses">
          <Button className="font-bold bg-black-others">Back to courses</Button>
        </Link>
      </div>
      </section>
    </>
  );
}
