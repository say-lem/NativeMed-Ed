"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNavLink({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  const pathName = usePathname();

  if (label === "Log Out") {
    return (
      <div
        className={`cursor-pointer flex items-center space-x-2 py-3 leading-[150%] text-sm px-8 ${pathName === href ? "bg-primary10 text-primary100 font-semibold rounded-br-lg rounded-tr-lg" : "bg-transparent text-subtle2"}`}
      >
        {icon} <span className="">{label}</span>
      </div>
    );
  } else {
    return (
      <Link href={href}>
        <div
          className={`cursor-pointer flex items-center gap-2 py-3 leading-[150%] text-sm px-8 ${pathName === href ? "bg-primary10 text-primary100 font-semibold rounded-br-lg rounded-tr-lg" : "bg-transparent text-subtle2"}`}
        >
          {icon} <span className="">{label}</span>
        </div>
      </Link>
    );
  }
}
