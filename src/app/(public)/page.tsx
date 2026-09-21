import axios from "axios";
import HomeHero from "./_components/Hero";
import EverythingYouNeed from "./_components/EverythingYouNeed";
import WhatYouGet from "./_components/WhatYouGet";
import UpcomingEvents from "./_components/UpcomingEvents";
import Testimonial from "./_components/Testimonial";
import FaQs from "./_components/FaQs";
import FeaturedVideos from "./_components/FeaturedVideos";
// import CountDownToClass from "@/components/shared/Countdown";
import { getOptionalUser } from "@/lib/current-user";
import { getReviews } from "@/services/reviews.service";
import { getActivities } from "@/services/activities.service";
import { getHomepageData } from "@/services/homepage.service";
import type { Activity, HomepageData, Review } from "@/types/api";

const MAX_UPCOMING_EVENTS = 8;

const EMPTY_HOMEPAGE_DATA: HomepageData = {
  caseNumber: 0,
  testimonialsCount: 0,
  registrarsCount: 0,
  contactEmail: null,
  contactPhone: null,
  facebookUrl: null,
  whatsappUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  youtubeLinks: [],
};

/** Stats + admin-managed YouTube links. Falls back to zero/empty on a backend hiccup. */
async function loadHomepageData(): Promise<HomepageData> {
  try {
    const res = await getHomepageData();
    return res.success ? res.data : EMPTY_HOMEPAGE_DATA;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return EMPTY_HOMEPAGE_DATA;
  }
}

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
  const [user, reviews, events, homepage] = await Promise.all([
    getOptionalUser(),
    loadReviews(),
    loadUpcomingEvents(),
    loadHomepageData(),
  ]);
  return (
    <>
      <HomeHero isLoggedIn={!!user} />
      {/* <CountDownToClass /> */}
      <EverythingYouNeed
        caseNumber={homepage.caseNumber}
        testimonialsCount={homepage.testimonialsCount}
        registrarsCount={homepage.registrarsCount}
      />
      <WhatYouGet />
      <UpcomingEvents events={events} />
      <Testimonial reviews={reviews} />
      <FeaturedVideos videos={homepage.youtubeLinks} />
      <FaQs />
      
    </>
  );
}
