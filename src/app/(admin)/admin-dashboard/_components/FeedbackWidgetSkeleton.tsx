export default function FeedbackWidgetSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10 animate-pulse">
      <div className="h-7 w-40 rounded bg-gray-200 mb-4" />
      <div className="rounded-[8px] border border-[#EDEDED] flex flex-col divide-y divide-[#EDEDED]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-4 sm:px-6 py-4 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-full max-w-md rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
