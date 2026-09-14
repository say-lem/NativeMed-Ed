import axios from "axios";
import Image from "next/image";
import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import { getFaqs } from "@/services/homepage.service";
import type { Faq } from "@/types/api";
import FaqAccordion from "./FaqAccordion";

async function loadFaqs(): Promise<Faq[]> {
  try {
    const res = await getFaqs();
    return res.success ? res.data : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return [];
  }
}

async function FaQs() {
  const faqs = await loadFaqs();

  if (faqs.length === 0) return null;

  return (
    <>
      {/* Last section before the footer. `pb-2` is intentional and small: the footer no
          longer pulls itself up, and its own pt-40 provides the breathing room. This keeps
          the home page looking exactly as it did. */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-2">
        <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <ButtonTag title="FAQs" />
          <TitleCase text="Your Questions answered" />
        </div>

        <FaqAccordion faqs={faqs} />
      </section>

      <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] xl:h-[85vh] max-h-225">
        <Image
          src="/Images/doctorsGiving.svg"
          alt="givingDoctors Image"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </>
  );
}

export default FaQs;
