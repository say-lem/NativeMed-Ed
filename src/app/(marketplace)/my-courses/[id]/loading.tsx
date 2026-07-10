import { BannerSkeleton, ListRowsSkeleton } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton withSubtitle />
      <section className="px-4 sm:px-8 lg:px-15 py-6 sm:py-8 space-y-6">
        <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
        <ListRowsSkeleton count={4} />
      </section>
    </>
  );
}
