import AdminDashboardStat from "./_components/AdminDashboardStat";
import AdminHero from "./_components/AdminHero";
import RecentSubscribers from "./_components/RecentSubscribers";

export default function AdminDashboard() {
  return (
    <>
      <AdminHero />
      <AdminDashboardStat />
      <RecentSubscribers />
    </>
  );
}
