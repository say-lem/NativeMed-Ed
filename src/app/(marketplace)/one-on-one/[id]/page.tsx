import axios from "axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BannerBg from "@/app/(marketplace)/_components/BannerBg";
import { BannerTitleCase } from "@/components/shared/TitleCase";
import ContainedImage from "@/components/shared/ContainedImage";
import { Markdown } from "@/components/shared/Markdown";
import BookingForm from "./_components/BookingForm";
import { getBookingProduct } from "@/services/booking.service";
import { getSessionUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/price";
import type { BookingProduct } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadProduct(id: string): Promise<BookingProduct | null> {
  try {
    const res = await getBookingProduct(id);
    return res.success ? res.data : null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[one-on-one-detail] fetch error:", err.code, err.message);
    } else {
      console.error("[one-on-one-detail] unexpected error:", err);
    }
    return null;
  }
}

export default async function OneOnOneDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [product, user] = await Promise.all([loadProduct(id), getSessionUser()]);

  if (!product) {
    return (
      <section className="px-4 sm:px-8 lg:px-15 py-16">
        <Link
          href="/one-on-one"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others mb-8"
        >
          <ChevronLeft size={18} /> Back to 1-on-1 sessions
        </Link>
        <p className="text-center text-subtle-text py-12">
          We couldn&apos;t load this session. It may have been removed, or the
          backend is unavailable.
        </p>
      </section>
    );
  }

  return (
    <>
      <BannerBg color="#2D135C">
        <BannerTitleCase text={product.title} />
      </BannerBg>

      <section className="px-4 sm:px-8 lg:px-15 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <Link
          href="/one-on-one"
          className="inline-flex items-center gap-1 text-sm text-subtle-text hover:text-black-others"
        >
          <ChevronLeft size={18} /> Back to 1-on-1 sessions
        </Link>

        <div className="authFormBorder rounded-[16px] p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6">
          {product.imageUrl && (
            <div className="relative w-full md:basis-2/5 min-h-[35vh] sm:min-h-[40vh] md:min-h-0 shrink-0 rounded-[12px] overflow-hidden bg-gray-from-radial-bg">
              <ContainedImage
                src={product.imageUrl}
                alt={`image of ${product.title}`}
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          )}
          <div className="flex flex-col gap-3 justify-center">
            <p className="text-xl font-bold text-black-others">{formatMoney(product.price)}</p>
            <p className="font-light text-sm sm:text-base lg:text-lg leading-[150%] text-[#373737] whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Longer write-up — outside the hero card, shown only when the admin has set
            one. Stored as markdown from the admin's rich-text editor. */}
        {product.detailedDescription && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl text-black-others">
              About this session
            </h2>
            <Markdown className="text-sm sm:text-base lg:text-lg text-[#373737]">
              {product.detailedDescription}
            </Markdown>
          </div>
        )}

        <div className="space-y-5">
          <h2 className="font-semibold text-xl sm:text-2xl text-black-others">
            Pick a date and time
          </h2>
          <BookingForm product={product} user={user} />
        </div>
      </section>
    </>
  );
}
