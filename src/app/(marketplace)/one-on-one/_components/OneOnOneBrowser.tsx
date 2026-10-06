"use client";
import { useMemo, useState } from "react";
import SearchBanner from "@/components/shared/SearchBanner";
import OneOnOneCard from "./OneOnOneCard";
import MyBookingsList from "./MyBookingsList";
import type { BookingProduct, MyBooking } from "@/types/api";

type Tab = "available" | "my-bookings";

const TABS: { id: Tab; label: string }[] = [
  { id: "available", label: "Available Sessions" },
  { id: "my-bookings", label: "My Bookings" },
];

export default function OneOnOneBrowser({
  products,
  myBookings,
  error,
}: {
  products: BookingProduct[];
  myBookings: MyBooking[];
  error?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("available");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.title, p.description].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [query, products]);

  return (
    <>
      <SearchBanner
        title="1-on-1 Sessions"
        placeholder="Search sessions..."
        value={query}
        onChange={setQuery}
      />

      <div className="flex justify-center pt-6 sm:pt-8">
        <div className="inline-flex rounded-full border border-primary-20 p-1 bg-[rgba(245,239,255,0.5)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                tab === t.id
                  ? "bg-primary-100 text-white"
                  : "text-secondary-100 hover:text-primary-100"
              }`}
            >
              {t.label}
              {t.id === "my-bookings" && myBookings.length > 0 ? ` (${myBookings.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      {tab === "available" ? (
        !error && products.length > 0 && filtered.length === 0 ? (
          <p className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
            No sessions match &ldquo;{query.trim()}&rdquo;.
          </p>
        ) : (
          <OneOnOneCard products={filtered} error={error} />
        )
      ) : (
        <MyBookingsList bookings={myBookings} />
      )}
    </>
  );
}
