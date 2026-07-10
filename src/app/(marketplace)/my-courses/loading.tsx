import {
  BannerSkeleton,
  CourseCardGridSkeleton,
} from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton withSubtitle />
      <CourseCardGridSkeleton count={3} />
    </>
  );
}
