import Image from "next/image";
function TimerSvg() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.375 0.9375H5.625V2.1875H9.375V0.9375ZM6.875 9.0625H8.125V5.3125H6.875V9.0625ZM11.8938 4.93125L12.7813 4.04375C12.5125 3.725 12.2188 3.425 11.9 3.1625L11.0125 4.05C10.0438 3.275 8.825 2.8125 7.5 2.8125C4.39375 2.8125 1.875 5.33125 1.875 8.4375C1.875 11.5437 4.3875 14.0625 7.5 14.0625C10.6125 14.0625 13.125 11.5437 13.125 8.4375C13.125 7.1125 12.6625 5.89375 11.8938 4.93125ZM7.5 12.8125C5.08125 12.8125 3.125 10.8562 3.125 8.4375C3.125 6.01875 5.08125 4.0625 7.5 4.0625C9.91875 4.0625 11.875 6.01875 11.875 8.4375C11.875 10.8562 9.91875 12.8125 7.5 12.8125Z"
        fill="#6F6F6F"
      />
    </svg>
  );
}

const subscription = [
  {
    id: 1,
    tag: "Session",
    title: "Native MRCGP SCA Extensive Course",
    timer: "5 weeks",
    completion: "80%",
    img: "/Images/coursesImage.png",
  },
  {
    id: 2,
    tag: "Session",
    title: "1-on-1 Sessions with Dr Native (6 Cases)",
    timer: "5 weeks",
    completion: "0%",
    img: "/Images/coursesImage.png",
  },
  {
    id: 3,
    tag: "Session",
    title: "1-on-1 Sessions with Dr Native (6 Cases)",
    timer: "5 weeks",
    completion: "50%",
    img: "/Images/coursesImage.png",
  },
];

const subscriptionCard = subscription.map((card) => (
  <div
    key={card.id}
    className="rounded-[16px] overflow-hidden courseBorder space-y-6 pb-4 bg-white hover:scale-105 cursor-pointer"
  >
    <aside className="relative w-full min-h-40 sm:min-h-48 lg:min-h-64 ">
      <Image
        src={card.img}
        alt={`image of ${card.title}`}
        fill
        className="object-cover object-center rounded-[8px]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
        {card.tag}
      </p>
    </aside>

    <aside className="px-3 sm:px-4 lg:px-6 space-y-6">
      <p className="text-base sm:text-lg lg:text-xl font-semibold leading-[130%] tracking-[-1%] text-black-others line-clamp-2">
        {card.title}
      </p>

      <p className="flex items-center gap-2 text-xs sm:text-sm text-subtle-text">
        <TimerSvg />
        {card.timer}
      </p>
    </aside>
  </div>
));

export default function SubscriptionCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-9 py-12 px-8">
      {subscriptionCard}
    </div>
  );
}
