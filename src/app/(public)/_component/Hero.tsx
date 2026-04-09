import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="radialBgGradient px-15 pt-16 min-h-[120vh]">
      <div className="flex items-center justify-center">
        <Image
          src="/Images/socket tile.png"
          alt="Socket Tile"
          width={50}
          height={50}
        />
      </div>

      <div className="relative mt-14 flex items-center justify-center gap-15">
        <Image
          src="/Images/dna tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
        />

        <h1 className="text-center font-semibold text-7xl tracking-[-2%] leading-21.25">
          Master Your Medical Exams
          <br /> with <span className="text-primary100">Expert</span> Guidance
        </h1>
        <Image
          src="/Images/brain tile.png"
          alt="DNA Tile"
          width={50}
          height={50}
        />
      </div>
      <p className="text-center text-Subtle-text text-lg leading-[150%]">
        We go beyond exam preparation, equipping you with the confidence and{" "}
        <br />
        competence to excel as a General Practitioner or Family Physician.
      </p>

      <div className="mt-10 text-center">
        <Button className="bg-primary100 font-bold tracking-[-1%] leading-[120%] space-x-1">
          <span>Start Learning</span>
          <Image
            src="/Images/arrow_forward.png"
            alt="Arrow forward"
            width={13.33}
            height={13.33}
          />
        </Button>
      </div>

      <Image src="/Images/Elipses.png" alt="Elipses" fill className="my-44" />
    </section>
  );
}
