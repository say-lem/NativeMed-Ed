import HomeHero from "./_component/Hero";
import EverythingYouNeed from "./_component/EverythingYouNeed";
import WhatYouGet from "./_component/WhatYouGet";
import Testimonial from "./_component/Testimonial";
import FaQs from "./_component/FaQs";
import CountDownToClass from "@/components/shared/countdown";

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
