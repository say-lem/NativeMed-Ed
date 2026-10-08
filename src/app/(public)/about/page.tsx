import Founder from "./_components/Founder";
import AboutHero from "./_components/Hero";
import MissionStatement from "./_components/MissionStatement";
import GlobalReach from "./_components/GlobalReach";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      {/* <MissionStatement /> */}
      <Founder />
      <GlobalReach />
    </>
  );
}
