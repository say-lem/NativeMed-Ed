"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button — appears after the user scrolls down and
 * smooth-scrolls to the top. Mounted once per shell so it covers every page.
 */
export default function BackToTop({ threshold = 400 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-40 grid place-items-center size-11 rounded-full bg-[#2D135C] text-white shadow-lg hover:opacity-90 cursor-pointer transition-opacity"
    >
      <ArrowUp size={20} />
    </button>
  );
}
