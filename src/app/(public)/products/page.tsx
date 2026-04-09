import ClassCountdown from "@/components/shared/countdown";
import ProductsHero from "./_components/hero";

export default function ProductPage() {
  return (
    <>
      <ProductsHero />
      <ClassCountdown
        targetDate="2027-03-23T00:00:00"
        eventDateLabel="23rd March 2028"
        eventTitle="Live Class Starts In:"
        ctaLabel="Register Now"
      />
    </>
  );
}
