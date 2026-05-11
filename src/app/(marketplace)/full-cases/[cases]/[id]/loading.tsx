export default function Loading() {
  return (
    <>
      <div className="bg-[#5925B3] py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-3 flex-col flex items-center justify-center relative">
        <div className="self-start size-6 rounded bg-white/15 animate-pulse" />
        <div className="h-7 sm:h-9 w-64 sm:w-80 rounded-md bg-white/15 animate-pulse" />
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-20 rounded-full bg-white/15 animate-pulse"
            />
          ))}
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 sm:w-20 rounded bg-gray-1 animate-pulse"
            />
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="h-5 w-40 rounded bg-gray-1 animate-pulse" />

          <div className="border-[0.2px] border-gray-2 rounded-[10px] p-4 sm:p-6 space-y-3">
            <div className="h-3 w-1/2 rounded bg-gray-1 animate-pulse" />
            <div className="h-3 w-full rounded bg-gray-1 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gray-1 animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-gray-1 animate-pulse" />
          </div>

          <div className="border-[0.2px] border-gray-2 rounded-[10px] p-4 sm:p-6 space-y-3">
            <div className="h-3 w-1/3 rounded bg-gray-1 animate-pulse" />
            <div className="h-3 w-full rounded bg-gray-1 animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-gray-1 animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
