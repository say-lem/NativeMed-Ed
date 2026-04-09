import ClassCountdown from "@/components/shared/countdown";
import HomeHero from "./_component/Hero";

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
      <div>djddjjd</div>
    </>
  );
}
