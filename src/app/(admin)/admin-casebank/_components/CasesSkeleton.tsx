export default function CasesSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10 animate-pulse">
      {/* Filter + add */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-10 w-[190px] rounded-[4px] bg-gray-200" />
        <div className="h-11 w-32 rounded-[8px] bg-gray-200" />
      </div>

      {/* List rows */}
      <div className="mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-[#EDEDED] py-5"
          >
            <div className="space-y-2">
              <div className="h-4 w-64 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>
            <div className="size-6 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
