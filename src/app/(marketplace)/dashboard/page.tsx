import DashboardHero from "./_components/Hero";
import StatCards from "./_components/StatCards";
import SubscriptionsSection from "./_components/SubscriptionsSection";
import MyCoursesSection from "./_components/MyCoursesSection";
import { getSessionUser } from "@/lib/current-user";

export default async function DashboardPage() {
  // Admin redirect is handled one level up, in the (marketplace) layout.
  const user = await getSessionUser();
  const name = user?.fullName;

  return (
    <div className="py-6 space-y-8">
      {/* Top: welcome + stats */}
      <div className="px-4 sm:px-6 lg:px-10 space-y-6">
        <DashboardHero name={name} />
        <StatCards />
      </div>

      <SubscriptionsSection />
      <MyCoursesSection />
    </div>
  );
}
