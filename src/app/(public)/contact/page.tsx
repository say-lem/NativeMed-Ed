import SubtleText from "@/components/shared/SubtleText";
import SocialLinks from "./_components/SocialLinks";
import ContactForm from "./_components/ContactForm";

export default function Contact() {
  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-36 pb-8 sm:pb-12 md:pb-24 lg:pb-36 flex flex-col md:flex-row justify-between gap-8 md:gap-12">
      <aside className="w-full md:basis-1/3">
        <h2 className="font-semibold tracking-[-2%] text-3xl sm:text-4xl md:text-5xl leading-[130%] text-black-others">
          Feel Free To <span className="text-primary-100">Reach Out</span>
        </h2>
        <SubtleText text="Reach out to learn more about our programs and how we can support your success." />

        <SocialLinks />
      </aside>

      <ContactForm />
    </section>
  );
}
