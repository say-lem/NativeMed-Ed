"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import FeedbackFormModal from "./FeedbackFormModal";

/**
 * Floating feedback button — mounted once per shell (public, auth, marketplace,
 * admin) so it covers every page, mirroring BackToTop. Hidden on the member
 * dashboard, which already surfaces enough on-page actions.
 */
export default function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/dashboard") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Leave feedback"
        title="Leave feedback"
        className="fixed bottom-6 left-6 z-40 grid place-items-center size-11 rounded-full bg-primary-100 text-white shadow-lg hover:opacity-90 cursor-pointer transition-opacity"
      >
        <MessageCircle size={20} />
      </button>
      {open && <FeedbackFormModal onClose={() => setOpen(false)} />}
    </>
  );
}
