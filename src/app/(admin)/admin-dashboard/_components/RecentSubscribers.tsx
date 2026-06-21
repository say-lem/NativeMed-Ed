type Subscriber = {
  name: string;
  email: string;
  plan: string;
  date: string;
  status: "Active" | "Inactive";
};

const subscribers: Subscriber[] = [
  {
    name: "Dr. Amara Okafor",
    email: "amara.o@nhs.net",
    plan: "MRCGP SCA Revision Monthly",
    date: "14 Jun 2025",
    status: "Active",
  },
  {
    name: "Dr. Liam Chen",
    email: "liam.chen@healthcare.com",
    plan: "MRCGP SCA Revision Monthly",
    date: "22 Jul 2025",
    status: "Active",
  },
  {
    name: "Dr. Sofia Patel",
    email: "sofia.patel@medic.org",
    plan: "MRCGP SCA Revision Monthly",
    date: "05 Sep 2025",
    status: "Active",
  },
  {
    name: "Dr. Noah Thompson",
    email: "noah.t@hospital.net",
    plan: "MRCGP SCA Revision Monthly",
    date: "10 Oct 2025",
    status: "Active",
  },
  {
    name: "Dr. Maria Garcia",
    email: "maria.garcia@clinic.com",
    plan: "MRCGP SCA Revision Monthly",
    date: "18 Nov 2025",
    status: "Active",
  },
];

const rowGrid =
  "grid grid-cols-[1.4fr_1.6fr_1.6fr_1fr_auto] items-center gap-6";

function StatusBadge({ status }: { status: Subscriber["status"] }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 px-4 py-[2px] rounded-[33px] text-xs font-medium ${
        isActive
          ? "bg-[#E5FFEA] text-[#027A48]"
          : "bg-[#FFEAEA] text-[#D70117]"
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentSubscribers() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-8 mb-10">
      <h1 className="text-2xl leading-[130%] tracking-[-2%] text-black font-semibold mb-4">
        Recent Subscribers
      </h1>

      <div className="overflow-x-auto">
        <div className="min-w-[760px] flex flex-col">
          {subscribers.map((sub, idx) => (
            <div
              key={`${sub.email}-${idx}`}
              className={`${rowGrid} border-b border-[#EDEDED] py-5`}
            >
              <p className="text-[15px] font-semibold leading-[120%] tracking-[-0.02em] text-black-others truncate">
                {sub.name}
              </p>
              <p className="text-sm font-normal leading-[150%] text-subtle-text truncate">
                {sub.email}
              </p>
              <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black truncate">
                {sub.plan}
              </p>
              <p className="text-sm font-normal leading-[150%] tracking-[-0.02em] text-black-others whitespace-nowrap">
                {sub.date}
              </p>
              <div className="justify-self-end">
                <StatusBadge status={sub.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
