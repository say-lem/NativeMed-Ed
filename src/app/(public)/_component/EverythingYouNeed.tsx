import ButtonTag from "@/components/shared/buttonTag";
import Image from "next/image";
import SubtleText from "./SubtleText";
export default function EverythingYouNeed() {
  return (
    <section className="bg-grayFromRadialBg px-15 pt-64 flex gap-10 pb-28">
      <aside className="space-y-2 basis-2/5">
        <ButtonTag title="We Offer" />
        <h1 className="font-semibold text-6xl leding-[130px] tracking-[-2%] text-black">
          Everything You Need to <span className="text-primary100">Pass</span>{" "}
          Your Medical Exams
        </h1>
        <SubtleText
          text="Carefully curated tools, expert guidance, and proven resources to elevate
       your performance."
        />
      </aside>

      <aside className="basis-3/5">
        <Image
          src={"/Images/everythingYouNeed.png"}
          alt="Image of Everything you need"
          width={752}
          height={415}
        />
      </aside>
    </section>
  );
}
