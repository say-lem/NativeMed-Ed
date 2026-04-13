import TitleCase from "@/components/shared/titleCase";
import Image from "next/image";

const aboutFounder = ({ text }: { text: string }) => {
  return <p className="text-subtle2 text-base md:text-lg leading-[150%] mt-3 md:mt-5">{text}</p>;
};

const founderLaurel = ({ text }: { text: string }) => {
  return (
    <p className="text-base md:text-lg leading-[120%] tracking-[-2%] text-subtle2 -mt-2">
      {text}
    </p>
  );
};

function Founder() {
  return (
    <section className="px-4 md:px-15 radialBgGradient pt-12 md:pt-20 pb-24 md:pb-44">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <aside className="w-full md:basis-3/5">
          <TitleCase text="About The Founder" />
          {aboutFounder({
            text: "Native Medical Education was founded by Dr Clinton Ohaa, a dedicated and accomplished General Practitioner based in the South East of England. Dr Ohaa is a member of the Royal College of General Practitioners (MRCGP) and has also attained the Membership of the Royal College of Surgeons (MRCS). His diverse background in both surgical specialties and general practice provides him with a unique perspective on the challenges faced by doctors as they advance in their careers.",
          })}

          {aboutFounder({
            text: "Dr Ohaa is deeply committed to medical education, healthcare management, and minor surgery. His passion for teaching and his vision of seeing doctors excel and become independent, confident GPs inspired the creation of Native Medical Education.",
          })}

          {aboutFounder({
            text: "As an educator and mentor, Dr Ohaa is known for his approachable teaching style, deep clinical knowledge, and unwavering dedication to his students’ success. He understands the complexities of preparing for the SCA and MRCGP, and his goal is to provide the support, insights, and tools doctors need to succeed, not just in exams, but in their professional lives.",
          })}

          {aboutFounder({
            text: "Through Native Medical Education, Dr Ohaa strives to nurture a generation of healthcare professionals who are not only skilled and knowledgeable but also compassionate and patient-focused. His work is driven by a belief in the power of education to transform careers and improve the quality of care delivered to patients everywhere.",
          })}
        </aside>
        <aside className="w-full md:basis-2/5">
          <Image
            src="/Images/founder page.png"
            alt="Founder"
            height={474}
            width={464}
            className="w-full h-auto"
          />

          <div className="mt-2.5 space-y-2.5 text-center">
            <h2 className="text-xl md:text-2xl leading-[130%] -tracking-[2%] text-blackOthers font-semibold">
              Dr Clinton Ohaa
            </h2>
            <h4 className="font-semibold text-base md:text-lg leading-[120%] tracking-[-2%] text-blackOthers">
              MBBS, MRCS, MRCGP, MBA
            </h4>
            {founderLaurel({
              text: "with distinction",
            })}
            {founderLaurel({
              text: "(Healthcare management)",
            })}
            {founderLaurel({ text: "PGCert (Medical Education)" })}

            <p className="text-base md:text-lg leading-[120%] tracking-[-2%] mt-2.5 font-semibold text-Secondary100">
              FOUNDER
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Founder;
