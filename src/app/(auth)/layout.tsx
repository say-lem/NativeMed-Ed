"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import FeedbackButton from "@/components/shared/feedback/FeedbackButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // A brand-new tab's own "new tab" entry counts toward history.length, so a
  // direct/shared link to this page still shows length 2, not 1 — router.back()
  // would then exit the app entirely (landing on the blank new-tab page) rather
  // than doing nothing useful. Below that, there's no real prior app page to
  // return to, so send them home instead.
  const goBack = () => {
    if (window.history.length > 2) router.back();
    else router.push("/");
  };

  return (
    <main className="min-h-full bg-white px-4 sm:px-8 lg:px-15 pt-8 sm:pt-12 lg:pt-16">
      <button onClick={goBack} aria-label="Go back">
        <IoArrowBack className="size-4 text-secondary-100" />
      </button>

      {children}
      <FeedbackButton />
    </main>
  );
}
