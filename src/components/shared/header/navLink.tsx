"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={
        pathName === href
          ? "text-primary100 font-bold underline decoration-solid tracking-[-1%] decoration-[10%] underline-offset-[16%] hover:cursor-pointer"
          : "font-bold tracking-[-1%] text-Secondary100   "
      }
    >
      {label}
    </Link>
  );
}
