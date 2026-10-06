import axios from "axios";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { formatMoney } from "@/lib/price";
import { getBookingProducts } from "@/services/booking.service";
import type { BookingProduct } from "@/types/api";

const DASHBOARD_LIMIT = 3;

async function loadProducts(): Promise<BookingProduct[]> {
  try {
    const res = await getBookingProducts(1, DASHBOARD_LIMIT);
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[dashboard/one-on-one] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function OneOnOneSection() {
  const products = await loadProducts();

  if (products.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
          1-on-1 Sessions
        </h2>
        <Link
          href="/one-on-one"
          className="text-sm font-medium text-primary-100 hover:underline shrink-0"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product) => {
          // The public list already omits dates with zero available times.
          const openDates = product.availableDates.length;
          return (
            <Link
              key={product._id}
              href={`/one-on-one/${product._id}`}
              className="rounded-[16px] border border-primary-20 p-4 flex items-center gap-3 hover:border-primary-100 transition-colors"
            >
              <span className="grid place-items-center size-10 rounded-full bg-primary-10 text-primary-100 shrink-0">
                <CalendarClock size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black-others truncate">
                  {product.title}
                </p>
                <p className="text-xs text-subtle-text">
                  {formatMoney(product.price)}
                  {openDates > 0 ? ` · ${openDates} open date${openDates === 1 ? "" : "s"}` : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
