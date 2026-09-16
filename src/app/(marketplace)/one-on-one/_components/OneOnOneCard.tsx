import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatMoney } from "@/lib/price";
import type { BookingProduct } from "@/types/api";

export default function OneOnOneCard({
  products,
  error,
}: {
  products: BookingProduct[];
  error?: boolean;
}) {
  if (error) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        We couldn&apos;t load session products right now. Please try again in a moment.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
        No 1-on-1 sessions available right now. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-9 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
      {products.map((product) => {
        // The public list already omits dates with zero available times.
        const openDates = product.availableDates.length;
        return (
          <Link
            key={product._id}
            href={`/one-on-one/${product._id}`}
            className="rounded-[16px] overflow-hidden courseBorder p-4 sm:p-5 bg-white hover:scale-105 transition-transform cursor-pointer flex flex-col gap-3"
          >
            {product.imageUrl ? (
              <div className="relative w-full aspect-video rounded-[10px] overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <span className="absolute top-2 right-2 rounded-full bg-black-others text-white text-xs font-semibold px-3 py-1.5">
                  {formatMoney(product.price)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="grid place-items-center size-11 rounded-full bg-primary-10 text-primary-100 shrink-0">
                  <CalendarDays size={20} />
                </span>
                <span className="rounded-full bg-black-others text-white text-xs font-semibold px-3 py-1.5">
                  {formatMoney(product.price)}
                </span>
              </div>
            )}

            <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
              {product.title}
            </p>
            <p className="text-xs sm:text-sm leading-[150%] text-subtle-text line-clamp-3">
              {product.description}
            </p>
            <p className="text-xs text-subtle-text mt-auto">
              {openDates > 0
                ? `${openDates} date${openDates === 1 ? "" : "s"} available`
                : "No open dates right now"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
