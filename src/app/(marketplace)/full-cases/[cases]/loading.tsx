const ROW_COUNT = 6;

export default function Loading() {
  return (
    <>
      <div className="bg-[#5925B3] py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-3 flex-col flex items-center justify-center relative">
        <div className="self-start size-6 rounded bg-white/15 animate-pulse" />
        <div className="h-7 sm:h-9 w-48 sm:w-60 rounded-md bg-white/15 animate-pulse" />
        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] h-10 sm:h-11 bg-white/15 animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between border-b-[0.5px] px-2 sm:px-4 py-4 sm:py-6 border-gray-2 gap-4"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 sm:h-5 w-2/3 rounded bg-gray-1 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gray-1 animate-pulse" />
              <div className="h-3 w-20 rounded bg-gray-1 animate-pulse" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-1 animate-pulse shrink-0" />
          </div>
        ))}

        <div className="flex items-center justify-center gap-2 py-6 sm:py-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-md bg-gray-1 animate-pulse"
            />
          ))}
        </div>
      </div>
    </>
  );
}
