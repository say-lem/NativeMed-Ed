import Image from "next/image";
import Link from "next/link";
import type { Subscription } from "@/types/api";

const TIER_LABEL: Record<string, string> = {
  pdf_only: "PDF Only",
  pdf_drive: "PDF + Drive",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Deterministic date (UTC) so server and client render the same string. */
function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const isCourse = sub.type === "course";
  const title = isCourse ? sub.courseId?.title ?? "Course" : "Case Bank Access";
  const thumb = isCourse ? sub.courseId?.thumbnailUrl : undefined;
  const active = sub.status === "active";
  const endLabel = sub.cancelAtPeriodEnd ? "Cancels on" : "Renews on";

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
          className={`absolute top-2 right-2 rounded-[100px] py-1 px-3 text-xs font-semibold text-white capitalize ${
            active ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {active ? "Active" : sub.status}
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
              {TIER_LABEL[sub.tier] ?? sub.tier}
            </span>
          )}
        </div>

        {sub.currentPeriodEnd && (
          <p className="text-xs text-subtle-text">
            {endLabel} {formatDate(sub.currentPeriodEnd)}
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
