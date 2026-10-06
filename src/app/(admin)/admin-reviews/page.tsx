import { Suspense } from "react";
import axios from "axios";
import AdminReviewsHero from "./_components/AdminReviewsHero";
import AdminReviews from "./_components/AdminReviews";
import AdminReviewsSkeleton from "./_components/AdminReviewsSkeleton";
import { getAdminReviews } from "@/services/reviews.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { AdminReview } from "@/types/api";

async function loadReviews(): Promise<AdminReview[]> {
  try {
    const res = await getAdminReviews();
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function ReviewsData() {
  const reviews = await loadReviews();
  return <AdminReviews reviews={reviews} />;
}

export default function AdminReviewsPage() {
  return (
    <AdminListProvider>
      <section>
        <AdminReviewsHero />
        <Suspense fallback={<AdminReviewsSkeleton />}>
          <ReviewsData />
        </Suspense>
      </section>
    </AdminListProvider>
  );
}
