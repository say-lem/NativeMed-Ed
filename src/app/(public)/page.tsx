import HomeHero from "./_components/Hero";
import EverythingYouNeed from "./_components/EverythingYouNeed";
import WhatYouGet from "./_components/WhatYouGet";
import Testimonial from "./_components/Testimonial";
import FaQs from "./_components/FaQs";
import CountDownToClass from "@/components/shared/Countdown";

export default function Home() {
  return (
    <>
      <HomeHero />
      <CountDownToClass />
      <EverythingYouNeed />
      <WhatYouGet />
      <Testimonial />
      <FaQs />
    </>
  );
}
