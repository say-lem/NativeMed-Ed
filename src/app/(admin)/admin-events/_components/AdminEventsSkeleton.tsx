export default function AdminEventsSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6 mb-10 animate-pulse">
      <div className="flex justify-end">
        <div className="h-10 w-32 rounded-full bg-gray-200" />
      </div>
      <div className="mt-6 rounded-[8px] border border-[#EDEDED] overflow-hidden">
        <div className="bg-primary-10 px-4 sm:px-6 py-4">
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-6 border-b border-[#EDEDED] last:border-b-0 px-4 sm:px-6 py-5"
          >
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-200" />
            <div className="h-8 w-24 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
