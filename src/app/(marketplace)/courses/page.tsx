import YouMightAlsoLike from "@/components/shared/YouMightAlsoLike";
import CoursesCard from "./_components/CoursesCard";
import CoursesHero from "./_components/CoursesHero";

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CoursesCard />
      <YouMightAlsoLike />
    </>
  );
}
