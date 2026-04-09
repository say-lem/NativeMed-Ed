import ClassCountdown from "@/components/shared/countdown";
import HomeHero from "./_component/Hero";
import EverythingYouNeed from "./_component/EverythingYouNeed";
import WhatYouGet from "./_component/WhatYouGet";
import Testimonial from "./_component/Testimonial";
import FaQs from "./_component/FaQs";

export default function Home() {
  return (
    <>
      <HomeHero />
      <ClassCountdown
        targetDate="2027-03-23T00:00:00"
        eventDateLabel="23rd March 2028"
        eventTitle="Live Class Starts In:"
        ctaLabel="Register Now"
      />
      <EverythingYouNeed />
      <WhatYouGet />
      <Testimonial />
      <FaQs />
    </>
  );
}
