"use client";
import { useState } from "react";
import BookingProductsManager from "./BookingProductsManager";
import BookingsList from "./BookingsList";
import type { AdminBookingProduct, AdminSessionBooking } from "@/types/api";

type Tab = "products" | "bookings";

const TABS: { id: Tab; label: string }[] = [
  { id: "products", label: "Products" },
  { id: "bookings", label: "Bookings" },
];

export default function AdminBookingTabs({
  products,
  bookings,
}: {
  products: AdminBookingProduct[];
  bookings: AdminSessionBooking[];
}) {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-6 mb-10 space-y-6">
      <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-1 bg-gray-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-[6px] text-sm font-semibold cursor-pointer ${
              tab === t.id ? "bg-white shadow-sm text-primary-100" : "text-subtle-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" && <BookingProductsManager products={products} />}
      {tab === "bookings" && <BookingsList bookings={bookings} />}
    </div>
  );
}
