import ButtonTag from "@/components/shared/buttonTag";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="radialBgGradient  pt-16 min-h-[120vh]">
      <div className="relative mt-14 flex px-15 items-center justify-center gap-15">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="self-start"
        />
        <div className="w-[60%] py-10">
          <h1 className="text-center font-semibold text-5xl tracking-[-2%] leading-21.25 text-blackOthers ">
            More Than <span className="text-primary100">Exam</span> Preparation
          </h1>
          <p className="text-Subtle-text leading-[150%] mx-auto text-center">
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
          className="self-end"
        />
      </div>

      <div className="relative w-full h-screen -mt-[65vh]">
        <Image src="/Images/Elipses.png" alt="Elipses" loading="eager" fill />
      </div>

      {/* Bridging the gap in education section */}
      <div className="flex gap-36 pt-28 pb-40 px-15 justify-between">
        <aside className="basis-2/5">
          <ButtonTag title="Our Story" />

          <h2 className="font-semibold text-2xl leading-[130%] mt-3 -tracking-[2%]">
            Bridging the Gap in Medical Education
          </h2>

          <p className="mt-4 text-Subtle-text text-lg leading-[150%]">
            Native Medical Education was established in January 2024 with a
            clear mission: to create an accessible and affordable teaching
            platform tailored for doctors preparing for the Simulated
            Consultation Assessment (SCA) of the Membership of the Royal College
            of General Practitioners (MRCGP). We recognised the lack of
            comprehensive, high-quality resources in this space and were driven
            to bridge the gap.
          </p>
        </aside>
        <aside className="relative basis-2/5">
          <Image
            src={"/Images/side-view-nurses-studying-together 2.png"}
            alt="Nurses studying together"
            width={496}
            height={442}
          />
        </aside>
      </div>
    </section>
  );
}
