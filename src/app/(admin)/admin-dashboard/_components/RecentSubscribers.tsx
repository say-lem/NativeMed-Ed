import type { Subscriber } from "@/types/api";

const rowGrid =
  "grid grid-cols-[1.4fr_1.6fr_1.6fr_1fr_auto] items-center gap-6";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 px-4 py-[2px] rounded-[33px] text-xs font-medium ${
        isActive ? "bg-[#E5FFEA] text-[#027A48]" : "bg-[#FFEAEA] text-[#D70117]"
      }`}
    >
      {label}
    </span>
  );
}

export default function RecentSubscribers({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      <h1 className="text-2xl leading-[130%] tracking-[-2%] text-black font-semibold mb-4">
        Recent Subscribers
      </h1>

      {subscribers.length === 0 ? (
        <p className="text-subtle-text py-6">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[760px] flex flex-col">
            {subscribers.map((sub, idx) => (
              <div
                key={`${sub.email}-${sub.subscribedTo}-${idx}`}
                className={`${rowGrid} border-b border-[#EDEDED] py-5`}
              >
                <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-black-others truncate">
                  {sub.name}
                </p>
                <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                  {sub.email}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black truncate">
                  {sub.subscribedTo}
                </p>
                <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black-others whitespace-nowrap">
                  {formatDate(sub.expiryDate)}
                </p>
                <div className="justify-self-end">
                  <StatusBadge status={sub.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
