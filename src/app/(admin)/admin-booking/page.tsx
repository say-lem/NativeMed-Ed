import axios from "axios";
import AdminBookingHero from "./_components/AdminBookingHero";
import AdminBookingTabs from "./_components/AdminBookingTabs";
import AdminBookingRefreshError from "./_components/AdminBookingRefreshError";
import {
  getAdminBookingProducts,
  getAdminBookings,
  getAdminSlotAvailabilityRequests,
} from "@/services/booking.service";
import type {
  AdminBookingProduct,
  AdminSessionBooking,
  AdminSlotAvailabilityRequest,
} from "@/types/api";

export const dynamic = "force-dynamic";

function itemsOf<T>(data: { items: T[] } | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return Array.isArray(data.items) ? data.items : [];
}

export default async function AdminBookingPage() {
  let products: AdminBookingProduct[] = [];
  let bookings: AdminSessionBooking[] = [];
  let slotRequests: AdminSlotAvailabilityRequest[] = [];
  let productsFailed = false;

  try {
    const [productsOutcome, bookingsOutcome, slotRequestsOutcome] =
      await Promise.allSettled([
        getAdminBookingProducts(1, 100),
        getAdminBookings(1, 100),
        getAdminSlotAvailabilityRequests(1, 100),
      ]);

    if (productsOutcome.status === "fulfilled" && productsOutcome.value.success) {
      products = itemsOf(productsOutcome.value.data);
    } else {
      productsFailed = true;
      if (productsOutcome.status === "rejected") {
        console.error("[admin-booking] products fetch:", productsOutcome.reason);
      } else if (!productsOutcome.value.success) {
        console.error("[admin-booking] products:", productsOutcome.value.message);
      }
    }

    if (bookingsOutcome.status === "fulfilled" && bookingsOutcome.value.success) {
      bookings = itemsOf(bookingsOutcome.value.data);
    } else if (bookingsOutcome.status === "rejected") {
      console.error("[admin-booking] bookings fetch:", bookingsOutcome.reason);
    }

    if (
      slotRequestsOutcome.status === "fulfilled" &&
      slotRequestsOutcome.value.success
    ) {
      slotRequests = itemsOf(slotRequestsOutcome.value.data);
    } else if (slotRequestsOutcome.status === "rejected") {
      console.error("[admin-booking] slot-requests fetch:", slotRequestsOutcome.reason);
    }
  } catch (err) {
    productsFailed = true;
    if (axios.isAxiosError(err)) {
      console.error("[admin-booking] axios error:", err.code, err.message);
    } else {
      console.error("[admin-booking] unexpected error:", err);
    }
  }

  return (
    <section>
      <AdminBookingHero />
      {productsFailed && products.length === 0 ? (
        <AdminBookingRefreshError />
      ) : (
        <AdminBookingTabs
          products={products}
          bookings={bookings}
          slotRequests={slotRequests}
        />
      )}
    </section>
  );
}
