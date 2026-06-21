import SubscriptionVariantCard, {
  type SubItem,
} from "./SubscriptionVariantCard";

const DESC =
  "Get access to over 150 comprehensive practice cases for just £49/month.";

const items: SubItem[] = [
  { id: 1, status: "active", title: "MRCGP SCA Revision", description: DESC, img: "/Images/coursesImage.png" },
  { id: 2, status: "expiring", title: "MRCGP SCA Revision", description: DESC, img: "/Images/coursesImage.png", expiresInDays: 14 },
  { id: 3, status: "expired", title: "MRCGP SCA Revision", description: DESC, img: "/Images/coursesImage.png" },
];

export default function SubscriptionsSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-black-others leading-[130%] tracking-[-2%]">
        Subscriptions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => (
          <SubscriptionVariantCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
