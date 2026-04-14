import { GrCart } from "react-icons/gr";

type AvatarSize = "sm" | "md" | "lg";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-xl",
};

const mockUser = {
  name: "John Doe",
  acctType: "Pro",
  cartCount: 3,
};

export default function NamedHeader({
  avatarSize = "md",
}: {
  avatarSize?: AvatarSize;
}) {
  return (
    <div className="flex gap-6 items-center">
      {/* Cart with notification badge */}
      <div className="relative">
        <GrCart className="text-Secondary100 size-4" />
        {mockUser.cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
            {mockUser.cartCount > 99 ? "99+" : mockUser.cartCount}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <aside
          className={`${sizeMap[avatarSize]} rounded-full bg-primary40 text-Secondary100 text-lg flex items-center justify-center font-medium select-none shrink-0`}
        >
          {getInitials(mockUser.name)}
        </aside>
        <aside className="flex flex-col">
          <h3 className="font-bold leading-[120%] text-sm tracking-[-1%] text-Secondary100">
            {mockUser.name}
          </h3>
          <p className="text-xs text-gray2 leading-[150%]">
            {mockUser.acctType} account
          </p>
        </aside>
      </div>
    </div>
  );
}
