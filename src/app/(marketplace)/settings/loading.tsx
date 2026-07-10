import { BannerSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton />
      <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-12 flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 border-[0.5px] border-[#B7B7B9] rounded-[12px] space-y-4"
          >
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </section>
    </>
  );
}
