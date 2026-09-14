import axios from "axios";
import OneOnOneBrowser from "./_components/OneOnOneBrowser";
import { getAllBookingProducts, getMyBookings } from "@/services/booking.service";
import type { BookingProduct, MyBooking } from "@/types/api";

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

async function loadMyBookings(): Promise<MyBooking[]> {
  try {
    const res = await getMyBookings(1, 100);
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[one-on-one/my-bookings] fetch error:", err.code, err.message);
    return [];
  }
}

export default async function OneOnOnePage() {
  const [{ products, error }, myBookings] = await Promise.all([
    loadProducts(),
    loadMyBookings(),
  ]);

  return <OneOnOneBrowser products={products} myBookings={myBookings} error={error} />;
}
