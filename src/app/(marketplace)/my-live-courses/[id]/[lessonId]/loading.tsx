import { BannerSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton withSubtitle />
      <section className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="mx-auto max-w-4xl aspect-[3/4] rounded-[8px] bg-gray-200 animate-pulse" />
      </section>
    </>
  );
}
