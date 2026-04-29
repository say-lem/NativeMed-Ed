import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="radialBgGradient min-h-[70vh] sm:min-h-[80vh] md:min-h-screen lg:min-h-[120vh] overflow-hidden relative">
      <div className="flex items-center justify-center px-4 sm:px-8 lg:px-15 pt-6 sm:pt-8 lg:pt-16">
        <Image
          src="/Images/socket tile.png"
          alt="Socket Tile"
          width={50}
          height={50}
          className="w-6 sm:w-7.5 lg:w-12.5 h-auto object-contain"
        />
      </div>

      <div className="relative mt-4 sm:mt-6 lg:mt-14 flex flex-col lg:flex-row items-center justify-center gap-4">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
          className="hidden lg:block object-contain"
        />

        <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-7xl tracking-[-2%] leading-[1.2] lg:leading-21.25 text-black-others max-w-full px-4 sm:px-6">
          Master Your Medical Exams with{" "}
          <span className="text-primary-100">Expert</span> Guidance
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="Brain Tile"
          width={50}
          height={50}
          className="hidden lg:block object-contain"
        />
      </div>
      <p className="text-subtle-text text-xs sm:text-sm md:text-base lg:text-lg leading-[150%] w-[92%] sm:w-[85%] md:w-[70%] lg:w-[60%] mx-auto text-center mt-3 sm:mt-4 lg:mt-0">
        We go beyond exam preparation, equipping you with the confidence and{" "}
        competence to excel as a General Practitioner or Family Physician.
      </p>

      <div className="mt-5 sm:mt-6 lg:mt-10 text-center">
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

      <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[60vh] lg:h-screen -mt-[20vh] sm:-mt-[25vh] md:-mt-[45vh] lg:-mt-[65vh]">
        <Image
          src="/Images/Elipses.png"
          alt="Elipses"
          priority
          fill
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
