"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={
        pathName === href
          ? "text-primary-100 font-bold underline decoration-solid tracking-[-1%] decoration-[10%] underline-offset-[16%] hover:cursor-pointer text-sm md:text-base"
          : "font-bold tracking-[-1%] text-secondary-100 text-sm md:text-base"
      }
    >
      {label}
    </Link>
  );
}

export function FooterNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={
        pathName === href
          ? "text-gray-1 font-bold tracking-[-1%] hover:cursor-pointer text-sm md:text-base"
          : "font-bold tracking-[-1%] text-subtle-text text-sm md:text-base"
      }
    >
      {label}
    </Link>
  );
}
