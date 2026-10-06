export default function UpcomingEventsWidgetSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10 animate-pulse">
      <div className="h-7 w-52 rounded bg-gray-200 mb-4" />
      <div className="overflow-x-auto">
        <div className="min-w-[500px] flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[140px_1fr] items-center gap-6 border-b border-[#EDEDED] py-5"
            >
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-64 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
