export default function AdminDashboardSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 animate-pulse">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-[0.5px] border-[#E0E0E0] p-5 rounded-[8px] adminCardShadow flex flex-col gap-2"
          >
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-9 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="my-10 sm:my-16 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 w-44 rounded-[8px] bg-gray-200" />
        ))}
      </div>
    </section>
  );
}
