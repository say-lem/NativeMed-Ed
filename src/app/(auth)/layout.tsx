"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <main className="min-h-full bg-white px-15 pt-16">
      <button onClick={() => router.back()}>
        <IoArrowBack className="size-4 text-Secondary100" />
      </button>

      {children}
    </main>
  );
}
