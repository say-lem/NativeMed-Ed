import axios from "axios";
import ReviewCard from "./_components/ReviewCard";
import PagePagination from "@/components/shared/PagePagination";
import LeaveReviewButton from "@/components/shared/footer/LeaveReviewButton";
import { getReviews } from "@/services/reviews.service";
import type { Paginated, Review } from "@/types/api";

export const metadata = {
  title: "Reviews",
};

const PAGE_LIMIT = 12;

async function loadReviews(page: number): Promise<Paginated<Review> | null> {
  try {
    const res = await getReviews(page, PAGE_LIMIT);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[reviews] fetch error:", err.code, err.message);
    } else {
      console.error("[reviews] unexpected error:", err);
    }
    return null;
  }
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const data = await loadReviews(page);

  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex flex-col items-center justify-center gap-3">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Reviews
        </h1>
        <p className="text-center text-subtle-text max-w-xl">
          What our students say about Native Medical Education.
        </p>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        {!data || data.items.length === 0 ? (
          <p className="text-center text-subtle-text py-10">
            {data ? "No reviews yet." : "We couldn't load reviews right now."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {data.items.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
            <PagePagination
              currentPage={data.page}
              totalPages={data.totalPages}
              basePath="/reviews"
            />
          </>
        )}

        <div className="flex flex-col items-center gap-4 text-center pt-8 sm:pt-10 border-t border-primary-20 mt-8 sm:mt-10">
          <p className="text-subtle-text">
            Passed your exam? Share your experience with future candidates.
          </p>
          <LeaveReviewButton variant="solid" />
        </div>
      </section>
    </>
  );
}
