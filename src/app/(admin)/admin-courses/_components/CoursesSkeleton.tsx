export default function CoursesSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10 animate-pulse">
      {/* Filter + create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-10 w-[190px] rounded-[4px] bg-gray-200" />
        <div className="h-11 w-36 rounded-[8px] bg-gray-200" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col"
          >
            <div className="w-full min-h-44 sm:min-h-48 bg-gray-200" />
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-2 flex-1">
              <div className="h-5 w-full rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-auto pt-3 flex items-center justify-between">
                <div className="h-5 w-16 rounded bg-gray-200" />
                <div className="h-9 w-16 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
