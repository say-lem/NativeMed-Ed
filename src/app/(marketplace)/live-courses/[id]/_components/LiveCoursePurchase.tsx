"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startLiveCourseCheckout } from "../actions";
import { formatMoney } from "@/lib/price";
import type { LiveCourse } from "@/types/api";

export default function LiveCoursePurchase({
  course,
  contactEmail,
}: {
  course: LiveCourse;
  contactEmail: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const ended = new Date(course.endDate) < new Date();

  const buy = () => {
    startTransition(async () => {
      const res = await startLiveCourseCheckout(course._id);
      if (res.ok && res.url) {
        window.location.assign(res.url);
        return;
      }
      if (res.alreadyPurchased) {
        toast.error(res.message ?? "You already have access to this live course.", {
          action: {
            label: "Go to course",
            onClick: () => router.push(`/my-live-courses/${course._id}`),
          },
        });
        return;
      }
      toast.error(res.message ?? "Couldn't start checkout.");
    });
  };

  if (course.paymentsPaused) {
    return (
      <div className="flex items-start gap-3 rounded-[16px] border border-[#FFC9C9] bg-[#FFF5F5] p-5">
        <MailWarning size={20} className="text-[#C11616] shrink-0 mt-0.5" />
        <p className="text-sm sm:text-base leading-[150%] text-[#7A1010]">
          Payment is not available at this time for this course. Please contact admin team
          for more info
          {contactEmail && (
            <>
              <br />
              email:{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold underline">
                {contactEmail}
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  if (ended) {
    return (
      <p className="text-sm text-subtle-text">
        This live course has already ended and is no longer available for purchase.
      </p>
    );
  }

  if (course.price == null) {
    return (
      <p className="text-sm text-subtle-text">
        This live course isn&apos;t available for purchase yet. Please check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-2xl font-bold text-black-others">{formatMoney(course.price)}</p>
      <Button
        type="button"
        onClick={buy}
        disabled={pending}
        className="w-full sm:w-auto font-bold text-sm sm:text-base bg-black-others disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        Buy Now — {formatMoney(course.price)}
      </Button>
    </div>
  );
}
