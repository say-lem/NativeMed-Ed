import {
  BannerSkeleton,
  CourseCardGridSkeleton,
} from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <>
      <BannerSkeleton withSearch />
      <CourseCardGridSkeleton count={3} />
    </>
  );
}
