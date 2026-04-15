import ButtonTag from "@/components/shared/ButtonTag";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="radialBgGradient pt-8 sm:pt-10 lg:pt-16 min-h-[70vh] sm:min-h-[80vh] md:min-h-[100vh] lg:min-h-[120vh]">
      <div className="relative mt-4 sm:mt-6 lg:mt-14 flex px-4 sm:px-8 lg:px-15 items-center justify-center gap-4 sm:gap-8 lg:gap-15">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start hidden lg:block object-contain"
        />
        <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] py-4 sm:py-6 lg:py-10">
          <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-2%] leading-[1.2] lg:leading-21.25 text-black-others">
            More Than <span className="text-primary-100">Exam</span> Preparation
          </h1>
          <p className="text-subtle-text text-xs sm:text-sm lg:text-base leading-[150%] mx-auto text-center mt-2">
            We are committed to helping you succeed in your SCA and MRCGP while
            building the confidence and competence to excel as a General
            Practitioner or Family Physician.
          </p>
        </div>

        <Image
          src="/Images/brain tile.png"
          alt="Brain Tile"
          width={50}
          height={50}
          className="self-end hidden lg:block object-contain"
        />
      </div>

      <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[60vh] lg:h-screen -mt-[20vh] sm:-mt-[25vh] md:-mt-[45vh] lg:-mt-[65vh]">
        <Image src="/Images/Elipses.png" alt="Elipses" priority fill className="object-cover object-bottom" sizes="100vw" />
      </div>

      {/* Bridging the gap in education section */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-36 pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-12 sm:pb-20 md:pb-28 lg:pb-40 px-4 sm:px-8 md:px-10 lg:px-15 justify-between">
        <aside className="w-full md:basis-2/5">
          <ButtonTag title="Our Story" />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] mt-3 -tracking-[2%]">
            Bridging the Gap in Medical Education
          </h2>

          <p className="mt-2 sm:mt-3 lg:mt-4 text-subtle-text text-sm sm:text-base lg:text-lg leading-[150%]">
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
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </aside>
      </div>
    </section>
  );
}
