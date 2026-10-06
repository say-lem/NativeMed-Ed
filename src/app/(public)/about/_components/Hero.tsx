import ButtonTag from "@/components/shared/ButtonTag";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="radialBgGradient pt-8 sm:pt-10 lg:pt-16 overflow-hidden">
      <div className="relative z-10 mt-4 sm:mt-6 lg:mt-14 flex px-4 sm:px-8 lg:px-15 items-center justify-center gap-4 sm:gap-8 lg:gap-15">
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

      {/* Decorative bottom arc. Height is width-relative (vw) so the crop is
          identical at every screen width (the old bug was a vh-sized box).
          object-bottom keeps the arcs; full width keeps the side sweeps. z-0 = behind. */}
      <div className="relative z-0 w-full h-[30vw] sm:h-[26vw] md:h-[24vw] lg:h-[22vw] -mt-[8vw] sm:-mt-[7vw] lg:-mt-[6vw]">
        <Image
          src="/Images/Elipses.png"
          alt=""
          aria-hidden
          priority
          fill
          className="object-cover object-bottom select-none pointer-events-none"
          sizes="100vw"
        />
      </div>

      {/* About Us section — text mirrors https://nativemeded.co.uk/about/ verbatim. */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-36 pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-12 sm:pb-20 md:pb-28 lg:pb-40 px-4 sm:px-8 md:px-10 lg:px-15 justify-between">
        <aside className="w-full md:basis-2/5">
          <ButtonTag title="About Us" />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] mt-3 -tracking-[2%]">
            Native Medical Education
          </h2>

          <div className="mt-2 sm:mt-3 lg:mt-4 space-y-3 sm:space-y-4">
            <p className="text-subtle-text text-sm sm:text-base lg:text-lg leading-[150%]">
              Native Medical Education was established in January 2024 with a
              clear mission: to create an accessible and affordable teaching
              platform tailored for doctors preparing for their Simulated
              Consultation Assessment (SCA) of the Membership of the Royal
              College of General Practitioners (MRCGP). We recognised the lack
              of comprehensive, high-quality resources in this space and were
              driven to bridge the gap.
            </p>
            <p className="text-subtle-text text-sm sm:text-base lg:text-lg leading-[150%]">
              At Native Medical Education, we are not just invested in helping
              you pass your exams; we are passionate about nurturing your
              confidence and competence as General Practitioners and Family
              Physicians. We aim to equip you with the tools, knowledge, and
              skills needed to deliver exceptional care to your patients.
            </p>
            <p className="text-subtle-text text-sm sm:text-base lg:text-lg leading-[150%]">
              Our team is dedicated to creating a supportive and enriching
              learning environment that combines expert-led guidance,
              practical insights, and a focus on real-world clinical
              scenarios. We are committed to excellence in medical education
              and are proud to be your trusted partner in achieving your
              career goals.
            </p>
            <p className="text-subtle-text text-sm sm:text-base lg:text-lg leading-[150%]">
              Native Medical Education isn&apos;t just about passing exams,
              it&apos;s about shaping the future of healthcare, one doctor at
              a time.
            </p>
          </div>
        </aside>
        <aside className="relative w-full md:basis-2/5 flex items-center justify-center">
          <Image
            src="/Images/main_logo.png"
            alt="Native Medical Education logo"
            width={420}
            height={412}
            className="w-full max-w-xs sm:max-w-sm h-auto object-contain"
          />
        </aside>
      </div>
    </section>
  );
}
