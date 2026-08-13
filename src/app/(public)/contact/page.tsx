import SubtleText from "@/components/shared/SubtleText";
import SocialLinks from "./_components/SocialLinks";
import { Button } from "@/components/ui/button";

function Label({ text }: { text: string }) {
  return (
    <p className="text-secondary-100 leading-[120%] tracking-[-1%] ">{text}</p>
  );
}

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
      <aside className="w-full md:basis-2/3 rounded-[16px] border border-primary-20 p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-5 md:space-y-7">
        <div className="space-y-2">
          <Label text="Full Name" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary-20 w-full "
          />
        </div>
        <div className="space-y-2">
          <Label text="Email Address" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary-20 w-full "
          />
        </div>
        <div className="space-y-2">
          <Label text="Message" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary-20 w-full "
          />
        </div>

        <div className="text-right">
          <Button className="bg-black-others font-bold">Send Message</Button>
        </div>
      </aside>
    </section>
  );
}
