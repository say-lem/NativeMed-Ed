"use client";
import { useRouter } from "next/navigation";

export default function BackIcon() {
  const router = useRouter();
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => router.back()}
    >
      <path
        d="M20 8.75H4.7875L11.775 1.7625L10 0L0 10L10 20L11.7625 18.2375L4.7875 11.25H20V8.75Z"
        fill="white"
      />
    </svg>
  );
}
