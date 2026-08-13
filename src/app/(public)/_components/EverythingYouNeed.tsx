import ButtonTag from "@/components/shared/ButtonTag";
import Image from "next/image";
import SubtleText from "@/components/shared/SubtleText";
export default function EverythingYouNeed() {
  // Top padding intentionally mirrors the bottom (pb-*) so the section reads as one
  // rhythm. It used to be pt-32/pt-64, which left a ~250px void under the hero.
  return (
    <section className="bg-gray-from-radial-bg px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-20 lg:pt-28 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 pb-10 sm:pb-16 md:pb-20 lg:pb-28">
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
        {/* Inner wrapper is sized by the image itself (h-auto). The <aside> is a flex item
            and stretches to match the tall heading beside it, so anchoring the overlay to
            the aside would centre it in a too-tall box and push the text off its baseline. */}
        <div className="relative w-full">
          <Image
            src={"/Images/everythingImage.svg"}
            alt="What you get: 200+ SCA cases, live classes, Case Bank, pre-recorded lectures, 300+ testimonies, and 3k+ GP registrars"
            width={752}
            height={415}
            className="block w-full h-auto"
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/*
            Several labels are rendered here rather than in the artwork. Figma exported that
            SVG with "Outline text" on, so every label inside it is a <path> — the glyphs are
            shapes, not editable text. The paths for these particular labels were removed from
            the file and the copy lives here instead, so it can be changed without a re-export.

            Still baked into the SVG (change = new export): "SCA Cases", "Live Classes",
            "Testimonies".

            Coordinates are the originals, and the viewBox matches the artwork (752x415), so
            everything lines up and scales with the image at any width. Inline SVG inherits the
            page font, so this renders in Fustat like the rest of the site.
          */}
          <svg
            viewBox="0 0 752 415"
            preserveAspectRatio="xMinYMin meet"
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
          >
            {/* Top-left card */}
            <text
              x="17.32"
              y="250.6"
              fill="#F7F4FB"
              fontSize="40"
              fontWeight="700"
              letterSpacing="-1"
            >
              200+
            </text>

            {/* Middle card — number only; "Testimonies" below it is still artwork */}
            <text
              x="272.6"
              y="355"
              fill="#F7F4FB"
              fontSize="40"
              fontWeight="700"
              letterSpacing="-1"
            >
              300+
            </text>

            {/* Top-right card — number and label */}
            <text
              x="529.32"
              y="250.6"
              fill="#F7F4FB"
              fontSize="40"
              fontWeight="700"
              letterSpacing="-1"
            >
              3k+
            </text>
            <text x="529.32" y="283.288" fill="#F7F4FB" fontSize="24">
              GP registrars
            </text>

            {/* Bottom-left card — centred in a 240-wide card (0–240) */}
            <text
              x="120"
              y="378"
              fill="white"
              fontSize="24"
              fontWeight="500"
              textAnchor="middle"
            >
              Case Bank
            </text>

            {/* Bottom-right card — centred, and on two lines because "Pre-recorded
                lectures" is too long for the 240-wide card on one */}
            <text
              x="632"
              y="365"
              fill="white"
              fontSize="22"
              fontWeight="500"
              textAnchor="middle"
            >
              Pre-recorded
            </text>
            <text
              x="632"
              y="391"
              fill="white"
              fontSize="22"
              fontWeight="500"
              textAnchor="middle"
            >
              lectures
            </text>
          </svg>
        </div>
      </aside>
    </section>
  );
}
