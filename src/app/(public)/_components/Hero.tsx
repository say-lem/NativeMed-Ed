import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="radialBgGradient  min-h-[80vh] md:min-h-[120vh] overflow-hidden relative">
      <div className="flex items-center justify-center px-4 md:px-15 pt-8 md:pt-16">
        <Image
          src="/Images/socket tile.png"
          alt="Socket Tile"
          width={50}
          height={50}
          className="w-7.5 md:w-12.5 h-auto"
        />
      </div>

      <div className="relative mt-6 md:mt-14 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-15">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="hidden md:block"
        />

        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-7xl tracking-[-2%] leading-[1.2] md:leading-21.25 text-black-others max-w-full px-1">
          Master Your Medical Exams with{" "}
          <span className="text-primary-100">Expert</span> Guidance
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="hidden md:block"
        />
      </div>
      <p className="text-subtle-text text-sm sm:text-base md:text-lg leading-[150%] w-[95%] sm:w-[90%] md:w-[60%] mx-auto text-center mt-4 md:mt-0">
        We go beyond exam preparation, equipping you with the confidence and{" "}
        competence to excel as a General Practitioner or Family Physician.
      </p>

      <div className="mt-6 md:mt-10 text-center">
        <Button className="bg-primary-100 font-bold tracking-[-1%] leading-[120%] space-x-1">
          <span>Start Learning</span>
          <Image
            src="/Images/arrow_forward.png"
            alt="Arrow forward"
            width={13.33}
            height={13.33}
          />
        </Button>
      </div>

      <div className="relative w-full h-[40vh] md:h-screen -mt-[30vh] md:-mt-[65vh]">
        <Image src="/Images/Elipses.png" alt="Elipses" loading="eager" fill />
      </div>
    </section>
  );
}
