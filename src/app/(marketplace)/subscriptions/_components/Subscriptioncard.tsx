import Image from "next/image";
import Link from "next/link";
import type { Subscription } from "@/types/api";
import { tierLabel } from "@/lib/tiers";
import { statusMeta, type StatusTone } from "@/lib/subscription-status";
import { formatDate } from "@/lib/date";

const TONE_BADGE: Record<StatusTone, string> = {
  good: "bg-green-600",
  warn: "bg-amber-500",
  dead: "bg-gray-500",
};

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const isCourse = sub.type === "course";
  const title = isCourse ? sub.courseId?.title ?? "Course" : "Case Bank Access";
  const thumb = isCourse ? sub.courseId?.thumbnailUrl : undefined;
  const meta = statusMeta(sub.status, sub.currentPeriodEnd);
  // `past_due` keeps access, so the period end is still meaningful. Once `statusMeta` has
  // relabelled a stale active/past_due as Expired, say so here too rather than showing a
  // "Renews on"/"Access until" date that's already in the past.
  const endLabel =
    meta.label === "Expired" ? "Expired on" : sub.cancelAtPeriodEnd ? "Access until" : "Renews on";

  return (
    <div className="rounded-[16px] overflow-hidden courseBorder pb-4 bg-white flex flex-col">
      <div className="relative w-full min-h-40 sm:min-h-48">
        <Image
          src={thumb || "/Images/coursesImage.png"}
          alt={`image of ${title}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span
          className={`absolute top-2 right-2 rounded-[100px] py-1 px-3 text-xs font-semibold text-white capitalize ${TONE_BADGE[meta.tone]}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-2 flex-1">
        <p className="font-semibold text-base text-black-others line-clamp-2">
          {title}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-primary-10 text-primary-100 px-2 py-1 capitalize">
            {sub.billingInterval}
          </span>
          {isCourse && sub.tier && (
            <span className="rounded-full bg-primary-10 text-primary-100 px-2 py-1">
              {tierLabel(sub.tier)}
            </span>
          )}
        </div>

        {sub.currentPeriodEnd && (
          <p className="text-xs text-subtle-text">
            {endLabel} {formatDate(sub.currentPeriodEnd)}
          </p>
        )}

        {meta.notice && (
          <p className="rounded-[6px] bg-[#FFF8EC] border border-[#F5C26B] px-2 py-1.5 text-xs text-[#7A4B00] leading-[150%]">
            {meta.notice}
          </p>
        )}

        {isCourse ? (
          sub.courseId?._id && (
            <Link
              href={`/my-courses/${sub.courseId._id}`}
              className="inline-block text-sm text-primary-100 font-medium hover:underline"
            >
              Go to course →
            </Link>
          )
        ) : (
          <Link
            href="/full-cases"
            className="inline-block text-sm text-primary-100 font-medium hover:underline"
          >
            Go to cases →
          </Link>
        )}
      </div>
    </div>
  );
}
