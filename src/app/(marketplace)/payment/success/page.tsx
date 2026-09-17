import { BannerTitleCase } from "@/components/shared/TitleCase";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import ActivationStatus from "./_components/ActivationStatus";

interface PageProps {
  // `type`/`courseId` are set on the Stripe successUrl by lib/checkout.ts. `session_id` is
  // Stripe's own placeholder — unused for case_bank/course (access comes from the webhook
  // alone), but a booking's poll needs it to identify which booking was just paid for
  // (see one-on-one/[id]/actions.ts and payment/success/actions.ts).
  searchParams: Promise<{
    type?: string;
    courseId?: string;
    session_id?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { type, courseId, session_id: sessionId } = await searchParams;

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text="Payment" />
      </BannerBg>
      <section className="px-4 sm:px-8 lg:px-15 py-16 sm:py-24 flex flex-col items-center">
        <ActivationStatus type={type ?? "case_bank"} courseId={courseId} sessionId={sessionId} />
      </section>
    </>
  );
}
