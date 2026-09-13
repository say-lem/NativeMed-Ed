import axios from "axios";
import OneOnOneBrowser from "./_components/OneOnOneBrowser";
import { getAllBookingProducts } from "@/services/booking.service";
import type { BookingProduct } from "@/types/api";

async function loadProducts(): Promise<{ products: BookingProduct[]; error: boolean }> {
  try {
    const products = await getAllBookingProducts();
    return { products, error: false };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[one-on-one] fetch error:", err.code, err.message);
    return { products: [], error: true };
  }
}

export default async function OneOnOnePage() {
  const { products, error } = await loadProducts();

  return <OneOnOneBrowser products={products} error={error} />;
}
