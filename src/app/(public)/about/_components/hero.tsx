import ButtonTag from "@/components/shared/ButtonTag";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="radialBgGradient pt-10 md:pt-16 min-h-[80vh] md:min-h-[120vh]">
      <div className="relative mt-6 md:mt-14 flex px-4 md:px-15 items-center justify-center gap-4 md:gap-15">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start hidden md:block"
        />
        <div className="w-[95%] md:w-[60%] py-6 md:py-10">
          <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl tracking-[-2%] leading-[1.2] md:leading-21.25 text-black-others">
            More Than <span className="text-primary-100">Exam</span> Preparation
          </h1>
          <p className="text-subtle-text text-sm md:text-base leading-[150%] mx-auto text-center mt-2">
            We are committed to helping you succeed in your SCA and MRCGP while
            building the confidence and competence to excel as a General
            Practitioner or Family Physician.
          </p>
        </div>

        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-end hidden md:block"
        />
      </div>

      <div className="relative w-full h-[40vh] md:h-screen -mt-[30vh] md:-mt-[65vh]">
        <Image src="/Images/Elipses.png" alt="Elipses" loading="eager" fill />
      </div>

      {/* Bridging the gap in education section */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-36 pt-16 md:pt-28 pb-20 md:pb-40 px-4 md:px-15 justify-between">
        <aside className="w-full md:basis-2/5">
          <ButtonTag title="Our Story" />

          <h2 className="font-semibold text-xl md:text-2xl leading-[130%] mt-3 -tracking-[2%]">
            Bridging the Gap in Medical Education
          </h2>

          <p className="mt-3 md:mt-4 text-subtle-text text-base md:text-lg leading-[150%]">
            Native Medical Education was established in January 2024 with a
            clear mission: to create an accessible and affordable teaching
            platform tailored for doctors preparing for the Simulated
            Consultation Assessment (SCA) of the Membership of the Royal College
            of General Practitioners (MRCGP). We recognised the lack of
            comprehensive, high-quality resources in this space and were driven
            to bridge the gap.
          </p>
        </aside>
        <aside className="relative w-full md:basis-2/5">
          <Image
            src={"/Images/side-view-nurses-studying-together 2.png"}
            alt="Nurses studying together"
            width={496}
            height={442}
            className="w-full h-auto"
          />
        </aside>
      </div>
    </section>
  );
}
