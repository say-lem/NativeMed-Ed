"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions";

const baseClass =
  "cursor-pointer flex items-center gap-2 py-3 leading-[150%] text-sm px-5 sm:px-6 lg:px-8 w-full text-left";

const activeClass =
  "bg-primary-10 text-primary-100 font-semibold rounded-br-lg rounded-tr-lg";
const inactiveClass = "bg-transparent text-subtle-2";

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
  const active = pathName.startsWith(href);
  const className = `${baseClass} ${active ? activeClass : inactiveClass}`;

  if (label === "Log Out") {
    return (
      <form action={logoutAction}>
        <button type="submit" className={className}>
          {icon} <span>{label}</span>
        </button>
      </form>
    );
  }

  return (
    <Link href={href} className={className}>
      {icon} <span>{label}</span>
    </Link>
  );
}
