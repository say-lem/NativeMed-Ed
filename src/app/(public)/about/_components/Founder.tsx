import axios from "axios";
import Image from "next/image";
import TitleCase from "@/components/shared/TitleCase";
import { Markdown } from "@/components/shared/Markdown";
import { DEFAULT_FOUNDER_BIO } from "@/lib/legal-content";
import { getFounderBio } from "@/services/homepage.service";

async function loadFounderBio(): Promise<string> {
  try {
    const res = await getFounderBio();
    if (res.success && res.data.content) return res.data.content;
    return DEFAULT_FOUNDER_BIO;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return DEFAULT_FOUNDER_BIO;
  }
}

const founderLaurel = ({ text }: { text: string }) => {
  return (
    <p className="text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-subtle-2 -mt-2">
      {text}
    </p>
  );
};

async function Founder() {
  const bio = await loadFounderBio();

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-10">
        <aside className="w-full md:basis-2/5">
          <Image
            src="/Images/founder page.png"
            alt="Founder"
            height={474}
            width={464}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          <div className="mt-2.5 space-y-2.5 text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others font-semibold">
              Dr Clinton Ohaa
            </h2>
            <h4 className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others">
              MBBS, MRCS, MRCGP, MBA
            </h4>
            {founderLaurel({
              text: "with distinction",
            })}
            {founderLaurel({
              text: "(Healthcare management)",
            })}
            {founderLaurel({ text: "PGCert (Medical Education)" })}

            <p className="text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] mt-2.5 font-semibold text-secondary-100">
              FOUNDER
            </p>
          </div>
        </aside>
        <aside className="w-full md:basis-3/5">
          <TitleCase text="About The Founder" />
          <Markdown className="text-subtle-2 text-sm sm:text-base lg:text-lg leading-[150%] mt-2 sm:mt-3 lg:mt-5">
            {bio}
          </Markdown>
        </aside>
      </div>
    </section>
  );
}

export default Founder;
