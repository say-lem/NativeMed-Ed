import Image from "next/image";

export type SubStatus = "active" | "expiring" | "expired";

export type SubItem = {
  id: number;
  status: SubStatus;
  title: string;
  description: string;
  img: string;
  expiresInDays?: number;
};

function Badge({ item }: { item: SubItem }) {
  if (item.status === "expired") {
    return (
      <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-[#C11616] text-white text-xs font-semibold leading-none">
        Expired
      </span>
    );
  }
  if (item.status === "expiring") {
    return (
      <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-white text-[#080A0D] text-xs font-semibold leading-none flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-[#C11616]" />
        Expires in {item.expiresInDays ?? 14} Days
      </span>
    );
  }
  return (
    <span className="absolute top-3 left-3 rounded-[100px] py-1.5 px-3 bg-[#00000080] border-[0.2px] border-white/80 text-primary-white text-xs font-semibold leading-none">
      Subscription
    </span>
  );
}

export default function SubscriptionVariantCard({ item }: { item: SubItem }) {
  const expired = item.status === "expired";
  return (
    <div className="rounded-[16px] overflow-hidden courseBorder bg-white flex flex-col">
      <div className="relative w-full h-40 sm:h-44">
        <Image src={item.img} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <Badge item={item} />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-base font-semibold text-black-others leading-[130%] line-clamp-1">
          {item.title}
        </p>
        <p className="text-sm text-subtle-text leading-[150%] line-clamp-2">
          {item.description}
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            className={`rounded-full text-sm font-semibold px-5 py-2 cursor-pointer ${
              expired
                ? "bg-black text-white hover:bg-black/85"
                : "border border-primary-100 text-primary-100 hover:bg-primary-10"
            }`}
          >
            {expired ? "Renew Subscription" : "Start Practicing"}
          </button>
        </div>
      </div>
    </div>
  );
}
