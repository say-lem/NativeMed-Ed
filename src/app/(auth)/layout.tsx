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
    <main className="min-h-full bg-white px-4 sm:px-8 lg:px-15 pt-8 sm:pt-12 lg:pt-16">
      <button onClick={() => router.back()}>
        <IoArrowBack className="size-4 text-secondary-100" />
      </button>

      {children}
    </main>
  );
}
