import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";

interface PageProps {
  // `from` is set on the Stripe cancelUrl by the originating checkout action (e.g.
  // one-on-one/[id]/actions.ts) so this page can point "back" somewhere relevant.
  searchParams: Promise<{ from?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: PageProps) {
  const { from } = await searchParams;
  const isBooking = from === "booking";

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
        {isBooking
          ? // The slot stays held until Stripe's checkout session actually expires (not
            // immediately on cancel), so this deliberately doesn't promise it's free again yet.
            "No charge was made. If you still want that session, head back and try booking again."
          : "No charge was made. You can pick a plan and try again whenever you're ready."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link href={isBooking ? "/one-on-one" : "/courses"}>
          <Button className="font-bold bg-black-others">
            {isBooking ? "Back to sessions" : "Back to courses"}
          </Button>
        </Link>
      </div>
      </section>
    </>
  );
}
