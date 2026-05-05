import Link from "next/link";
import { GrCart } from "react-icons/gr";
import type { User } from "@/types/api";

type AvatarSize = "sm" | "md" | "lg";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return ((parts[0][0] ?? "") + (parts[1][0] ?? "")).toUpperCase();
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-xs sm:w-8 sm:h-8",
  md: "w-8 h-8 text-sm sm:w-9 sm:h-9 sm:text-base md:w-10 md:h-10",
  lg: "w-14 h-14 text-lg sm:w-16 sm:h-16 sm:text-xl",
};

export default function NamedHeader({
  user,
  cartCount = 0,
  avatarSize = "md",
}: {
  user: User;
  cartCount?: number;
  avatarSize?: AvatarSize;
}) {
  const accountLabel = user.role === "admin" ? "Admin" : "Member";

  return (
    <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
      <Link href="/cart" className="relative" aria-label="Cart">
        <GrCart className="text-secondary-100 size-4" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <aside
          className={`${sizeMap[avatarSize]} rounded-full bg-primary-40 text-secondary-100 flex items-center justify-center font-medium select-none shrink-0`}
        >
          {getInitials(user.fullName)}
        </aside>
        <aside className="hidden sm:flex flex-col">
          <h3 className="font-bold leading-[120%] text-sm tracking-[-1%] text-secondary-100">
            {user.fullName}
          </h3>
          <p className="text-xs text-gray-2 leading-[150%]">
            {accountLabel} account
          </p>
        </aside>
      </div>
    </div>
  );
}
