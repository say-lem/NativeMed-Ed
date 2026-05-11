const SKELETON_COUNT = 16;

export default function Loading() {
  return (
    <section>
      <div className="bg-[#2D135C] py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-3 flex-col flex items-center justify-center">
        <div className="h-7 sm:h-9 w-40 sm:w-48 rounded-md bg-white/15 animate-pulse" />
        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] h-10 sm:h-11 bg-white/15 animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-6 sm:py-8">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="border-[0.2px] p-3 sm:p-4 rounded-[16px] gap-3 sm:gap-4 bg-white border-gray-2 questionBankShadow flex items-center"
          >
            <div className="size-15 rounded-full bg-gray-1 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 sm:h-5 w-3/4 rounded bg-gray-1 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-gray-1 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
