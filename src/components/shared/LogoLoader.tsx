import Image from "next/image";

/**
 * Branded loading indicator — the Native Medical Education logo inside a spinning ring.
 * Use where a skeleton/shimmer doesn't fit (in-flight actions, modal pending,
 * full-form saves, indeterminate waits).
 */
export default function LogoLoader({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <span className="relative grid size-16 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary-10 border-t-primary-100" />
        <Image
          src="/Images/main_logo.png"
          alt=""
          width={36}
          height={36}
          priority
          className="size-9 object-contain animate-pulse"
        />
      </span>
      {label && <p className="text-sm text-subtle-text">{label}</p>}
    </div>
  );
}

/** Full-cover overlay variant — drop inside a `relative` container or over the viewport. */
export function LogoLoaderOverlay({
  label,
  fixed = false,
}: {
  label?: string;
  fixed?: boolean;
}) {
  return (
    <div
      className={`${
        fixed ? "fixed" : "absolute"
      } inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm`}
    >
      <LogoLoader label={label} />
    </div>
  );
}
