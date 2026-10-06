import { Mail, Phone } from "lucide-react";

function ContactInfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 sm:gap-4 rounded-full bg-white border border-primary-20 shadow-[0_8px_24px_rgba(89,37,179,0.12)] hover:shadow-[0_8px_28px_rgba(89,37,179,0.2)] transition-shadow px-4 py-3 sm:px-5 sm:py-4 w-fit max-w-full"
    >
      <span className="grid place-items-center size-11 sm:size-12 rounded-full bg-primary-10 text-primary-100 shrink-0">
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="font-bold text-sm sm:text-base text-black-others">{label} :</span>
        <span className="font-semibold text-xs sm:text-sm text-subtle-text truncate">
          {value}
        </span>
      </span>
    </a>
  );
}

export default function ContactInfoCards({
  email,
  phone,
}: {
  email: string | null;
  phone: string | null;
}) {
  if (!email && !phone) return null;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 mt-5 md:mt-7">
      {email && (
        <ContactInfoCard
          icon={<Mail size={20} />}
          label="Email Address"
          value={email}
          href={`mailto:${email}`}
        />
      )}
      {phone && (
        <ContactInfoCard
          icon={<Phone size={20} />}
          label="Phone Number"
          value={phone}
          href={`tel:${phone.replace(/\s+/g, "")}`}
        />
      )}
    </div>
  );
}
