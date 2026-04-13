import { FiFacebook, FiTwitter } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io5";
import { TbBrandYoutube } from "react-icons/tb";
import SubtleText from "../_component/SubtleText";
import { Button } from "@/components/ui/button";

function Label({ text }: { text: string }) {
  return (
    <p className="text-Secondary100 leading-[120%] tracking-[-1%] ">{text}</p>
  );
}

export default function Contact() {
  return (
    <section className="px-4 md:px-15 radialBgGradient pt-20 md:pt-36 pb-32 md:pb-60 flex flex-col md:flex-row justify-between gap-8 md:gap-12">
      <aside className="w-full md:basis-1/3">
        <h2 className="font-semibold tracking-[-2%] text-3xl sm:text-4xl md:text-5xl leading-[130%] text-blackOthers">
          Feel Free To <span className="text-primary100">Reach Out</span>
        </h2>
        <SubtleText text="Reach out to learn more about our programs and how we can support your success." />

        <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 md:mt-7">
          <button className="cursor-pointer p-2.25 rounded-full border border-primary20">
            <IoLogoInstagram className="size-5 text-blackOthers" />
          </button>
          <button className="cursor-pointer p-2.25 rounded-full border border-primary20">
            <FiFacebook className="size-5 text-blackOthers" />
          </button>
          <button className="cursor-pointer p-2.25 rounded-full border border-primary20">
            <FiTwitter className="size-5 text-blackOthers" />
          </button>
          <button className="cursor-pointer p-2.25 rounded-full border border-primary20">
            <TbBrandYoutube className="size-5 text-blackOthers" />
          </button>
        </div>
      </aside>
      <aside className="w-full md:basis-2/3 rounded-[16px] border border-primary20 p-5 md:p-8 space-y-5 md:space-y-7">
        <div className="space-y-2">
          <Label text="Full Name" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary20 w-full "
          />
        </div>
        <div className="space-y-2">
          <Label text="Email Address" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary20 w-full "
          />
        </div>
        <div className="space-y-2">
          <Label text="Message" />
          <input
            type="text"
            placeholder="John Doe"
            className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary20 w-full "
          />
        </div>

        <div className="text-right">
          <Button className="bg-blackOthers font-bold">Send Message</Button>
        </div>
      </aside>
    </section>
  );
}
