import { Globe, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: <Globe size={26} />,
    title: "Supporting Doctors in the UK and Beyond",
    text: "SCA-focused medical education and consultation skills training for doctors in the UK and internationally.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Trusted by Doctors.",
    text: "Trusted by doctors preparing for the the SCA and those who have successfully passed.",
  },
];

export default function GlobalReach() {
  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center gap-3 rounded-[16px] bg-gray-from-radial-bg px-6 py-8 sm:px-8 sm:py-10"
          >
            <span className="grid place-items-center size-14 rounded-full bg-primary-100 text-white shrink-0">
              {item.icon}
            </span>
            <h3 className="font-semibold text-lg sm:text-xl leading-[130%] -tracking-[2%] text-black-others">
              {item.title}
            </h3>
            <p className="text-subtle-text text-sm sm:text-base leading-[150%]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
