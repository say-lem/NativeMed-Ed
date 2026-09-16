import AdminBookingHero from "./_components/AdminBookingHero";
import AdminBookingTabs from "./_components/AdminBookingTabs";
import {
  getAdminBookingProducts,
  getAdminBookings,
  getAdminSlotAvailabilityRequests,
} from "@/services/booking.service";

export default async function AdminBookingPage() {
  const [productsRes, bookingsRes, slotRequestsRes] = await Promise.all([
    getAdminBookingProducts(1, 100),
    getAdminBookings(1, 100),
    getAdminSlotAvailabilityRequests(1, 100),
  ]);
  if (!productsRes.success) throw new Error(productsRes.message);
  if (!bookingsRes.success) throw new Error(bookingsRes.message);
  if (!slotRequestsRes.success) throw new Error(slotRequestsRes.message);

  return (
    <section>
      <AdminBookingHero />
      <AdminBookingTabs
        products={productsRes.data.items}
        bookings={bookingsRes.data.items}
        slotRequests={slotRequestsRes.data.items}
      />
    </section>
  );
}
