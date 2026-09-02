import axios from "axios";
import HomeHero from "./_components/Hero";
import EverythingYouNeed from "./_components/EverythingYouNeed";
import WhatYouGet from "./_components/WhatYouGet";
import UpcomingEvents from "./_components/UpcomingEvents";
import Testimonial from "./_components/Testimonial";
import FaQs from "./_components/FaQs";
// import CountDownToClass from "@/components/shared/Countdown";
import { getOptionalUser } from "@/lib/current-user";
import { getReviews } from "@/services/reviews.service";
import { getActivities } from "@/services/activities.service";
import type { Activity, Review } from "@/types/api";

const MAX_UPCOMING_EVENTS = 8;

async function loadReviews(): Promise<Review[]> {
  try {
    const res = await getReviews(1, 20);
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

/** No "upcoming" filter on the backend — fetch everything, then keep future dates only. */
async function loadUpcomingEvents(): Promise<Activity[]> {
  try {
    const res = await getActivities(1, 50);
    if (!res.success) return [];
    const now = Date.now();
    return res.data.items
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, MAX_UPCOMING_EVENTS);
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

export default async function Home() {
  const [user, reviews, events] = await Promise.all([
    getOptionalUser(),
    loadReviews(),
    loadUpcomingEvents(),
  ]);
  return (
    <>
      <HomeHero isLoggedIn={!!user} />
      {/* <CountDownToClass /> */}
      <EverythingYouNeed />
      <WhatYouGet />
      <UpcomingEvents events={events} />
      <Testimonial reviews={reviews} />
      <FaQs />
    </>
  );
}
