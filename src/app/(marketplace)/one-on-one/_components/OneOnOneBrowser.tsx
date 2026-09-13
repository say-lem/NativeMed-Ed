"use client";
import { useMemo, useState } from "react";
import SearchBanner from "@/components/shared/SearchBanner";
import OneOnOneCard from "./OneOnOneCard";
import type { BookingProduct } from "@/types/api";

export default function OneOnOneBrowser({
  products,
  error,
}: {
  products: BookingProduct[];
  error?: boolean;
}) {
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
      {!error && products.length > 0 && filtered.length === 0 ? (
        <p className="px-4 sm:px-6 md:px-8 py-16 text-center text-subtle-text">
          No sessions match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <OneOnOneCard products={filtered} error={error} />
      )}
    </>
  );
}
