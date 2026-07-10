import { BannerSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton />
      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-12 space-y-8">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />

        {/* Hero card */}
        <div className="authFormBorder rounded-[16px] p-3 sm:p-4 flex flex-col md:flex-row gap-6">
          <div className="w-full md:basis-1/2 min-h-[35vh] md:min-h-[50vh] rounded-lg bg-gray-200 animate-pulse" />
          <div className="w-full md:basis-1/2 flex flex-col justify-center gap-3">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Plan picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-40 rounded-[16px] bg-gray-200 animate-pulse" />
          <div className="h-40 rounded-[16px] bg-gray-200 animate-pulse" />
        </div>
      </section>
    </>
  );
}
