export default function RecentSubscribersSkeleton() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10 animate-pulse">
      <div className="h-7 w-52 rounded bg-gray-200 mb-4" />
      <div className="overflow-x-auto">
        <div className="min-w-[760px] flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_1.6fr_1.6fr_1fr_auto] items-center gap-6 border-b border-[#EDEDED] py-5"
            >
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-200 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
