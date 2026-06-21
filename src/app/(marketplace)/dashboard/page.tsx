import axios from "axios";
import DashboardHero from "./_components/Hero";
import StatCards from "./_components/StatCards";
import GoPremium from "./_components/GoPremium";
import CalendarCard from "./_components/CalendarCard";
import UpcomingClasses from "./_components/UpcomingClasses";
import SubscriptionsSection from "./_components/SubscriptionsSection";
import CoursesSection from "./_components/CoursesSection";
import { me } from "@/services/auth.service";

async function loadName(): Promise<string | undefined> {
  try {
    const res = await me();
    return res.success ? res.data.fullName : undefined;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

export default async function DashboardPage() {
  const name = await loadName();

  return (
    <div className="py-6 space-y-8">
      {/* Top: welcome + stats */}
      <div className="px-4 sm:px-6 lg:px-10 space-y-6">
        <DashboardHero name={name} />
        <StatCards />
      </div>

      <SubscriptionsSection />
      <CoursesSection />

      {/* Premium / Calendar / Upcoming — 3-column row at the bottom */}
      <section className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <GoPremium />
        <CalendarCard />
        <UpcomingClasses />
      </section>
    </div>
  );
}
