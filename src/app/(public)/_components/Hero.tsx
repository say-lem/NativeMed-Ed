import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import RotatingTagline from "./RotatingTagline";

export default function HomeHero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="radialBgGradient overflow-hidden relative">
      <div className="relative z-10">
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
          Master Your Medical Exams with <RotatingTagline />
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
        <Link href={isLoggedIn ? "/products" : "/products"}>
          <Button className="bg-primary-100 font-bold tracking-[-1%] leading-[120%] space-x-1">
            <span>{isLoggedIn ? "Start Learning" : "Start Learning"}</span>
            <Image
              src="/Images/arrow_forward.png"
              alt="Arrow forward"
              width={13.33}
              height={13.33}
            />
          </Button>
        </Link>
      </div>
      </div>

      {/* Decorative bottom arc. Height is width-relative (vw) so the crop is
          identical at every screen width — the old bug was a vh-sized box, whose
          ratio swung with viewport height and cropped the curve differently on
          every device. object-bottom keeps the arcs; full width keeps the side
          sweeps. A small vw pull tucks it just under the content. z-0 = behind. */}
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
    </section>
  );
}
