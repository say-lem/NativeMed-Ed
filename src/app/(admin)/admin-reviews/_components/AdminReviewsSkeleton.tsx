export default function AdminReviewsSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10 animate-pulse">
      <div className="mt-6 rounded-[8px] border border-[#EDEDED] overflow-hidden">
        <div className="bg-primary-10 px-4 sm:px-6 py-4">
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-6 border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-5"
          >
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-8 w-24 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
