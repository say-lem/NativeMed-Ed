/** Reusable loading skeletons for marketplace routes (used in loading.tsx files). */

export function BannerSkeleton({
  withSearch = false,
  withSubtitle = false,
}: {
  withSearch?: boolean;
  withSubtitle?: boolean;
}) {
  return (
    <div className="bg-[#2D135C] py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-3 flex-col flex items-center justify-center">
      <div className="h-7 sm:h-9 w-44 sm:w-56 rounded-md bg-white/15 animate-pulse" />
      {withSubtitle && (
        <div className="h-4 w-28 rounded bg-white/15 animate-pulse" />
      )}
      {withSearch && (
        <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] h-10 sm:h-11 bg-white/15 animate-pulse" />
      )}
    </div>
  );
}

export function CourseCardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-8 sm:py-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col"
        >
          <div className="w-full min-h-40 sm:min-h-48 bg-gray-200 animate-pulse" />
          <div className="px-4 py-4 flex flex-col gap-2 flex-1">
            <div className="h-5 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListRowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-[12px] border border-gray-1 bg-white p-4"
        >
          <div className="size-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function YmalSkeleton() {
  return (
    <section className="py-12 px-4 lg:px-8 space-y-4">
      <div className="h-7 w-48 rounded bg-gray-200 animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[16px] p-1 alsoLikeBorder flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:basis-1/4 min-h-40 sm:min-h-48 lg:min-h-64 rounded-[8px] bg-gray-200 animate-pulse" />
            <div className="w-full md:basis-3/4 py-4 px-6 flex flex-col gap-3">
              <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
              <div className="h-9 w-28 rounded bg-gray-200 animate-pulse ml-auto mt-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
