import { Globe, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: <Globe size={26} />,
    title: "Operating All over the World",
    text: "We operate for every students all over the World.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Trusted by doctors for doctors",
    text: "Trusted by doctors that have passed their SCA",
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
