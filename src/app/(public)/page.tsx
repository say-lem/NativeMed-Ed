import HomeHero from "./_components/Hero";
import EverythingYouNeed from "./_components/EverythingYouNeed";
import WhatYouGet from "./_components/WhatYouGet";
import Testimonial from "./_components/Testimonial";
import FaQs from "./_components/FaQs";
// import CountDownToClass from "@/components/shared/Countdown";
import { getOptionalUser } from "@/lib/current-user";

export default async function Home() {
  const user = await getOptionalUser();
  return (
    <>
      <HomeHero isLoggedIn={!!user} />
      {/* <CountDownToClass /> */}
      <EverythingYouNeed />
      <WhatYouGet />
      <Testimonial />
      <FaQs />
    </>
  );
}
