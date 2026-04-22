import ButtonTag from "@/components/shared/ButtonTag";
import Image from "next/image";
import SubtleText from "@/components/shared/SubtleText";
export default function EverythingYouNeed() {
  return (
    <section className="bg-gray-from-radial-bg px-4 sm:px-8 md:px-10 lg:px-15 pt-12 sm:pt-16 md:pt-32 lg:pt-64 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 pb-10 sm:pb-16 md:pb-20 lg:pb-28">
      <aside className="space-y-2 w-full md:basis-2/5">
        <ButtonTag title="We Offer" />
        <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-[1.3] lg:leading-[130%] tracking-[-2%] text-black">
          Everything You Need to <span className="text-primary-100">Pass</span>{" "}
          Your Medical Exams
        </h1>
        <SubtleText
          text="Carefully curated tools, expert guidance, and proven resources to elevate
       your performance."
        />
      </aside>

      <aside className="w-full md:basis-3/5 mt-2 sm:mt-4 md:mt-0">
        <Image
          src={"/Images/everythingImage.svg"}
          alt="Image of Everything you need"
          width={752}
          height={415}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </aside>
    </section>
  );
}
