import SubtleText from "@/components/shared/SubtleText";

export const metadata = {
  title: "Legal Disclaimer | Native Medical Education",
};

export default function LegalDisclaimer() {
  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex items-center justify-center">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Legal Disclaimer
        </h1>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others">
            Disclaimer
          </h2>

          <SubtleText
            text="The cases presented in our MRCGP SCA practice question bank resource are entirely fictional and created purely for educational purposes. They are products of imagination and do not represent any real-life patients, clinical scenarios, or official examination questions. Any resemblance to actual exam cases, individuals, or medical situations is purely coincidental and unintentional. These cases are designed to illustrate key learning points and should not be interpreted as direct medical advice or a substitute for clinical judgment. Medicine is a dynamic and evolving field, and while every effort has been made to align the content with current best practices, guidelines and clinical approaches may vary based on location, healthcare setting, and individual patient factors."
          />

          <SubtleText text="Healthcare professionals should always use their own clinical judgment and refer to the latest guidelines and recommendations from relevant authorities when making decisions in real-world practice. The authors do not assume responsibility for any consequences resulting from the use of the information provided in this resource." />
        </div>
      </section>
    </>
  );
}
