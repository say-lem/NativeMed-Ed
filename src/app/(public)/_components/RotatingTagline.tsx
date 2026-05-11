"use client";
import { useEffect, useState } from "react";

const phrases = [
  { primary: "Expert", rest: "Guidance" },
  { primary: "Professional", rest: "Support" },
  { primary: "Informed", rest: "Consultation" },
] as const;

const ROTATE_MS = 3000;

export default function RotatingTagline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % phrases.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="inline-grid align-baseline motion-reduce:[&>span]:transition-none"
      aria-live="polite"
    >
      {phrases.map((p, i) => {
        const isActive = i === active;
        return (
          <span
            key={i}
            aria-hidden={!isActive}
            className="col-start-1 row-start-1 transition-all duration-500 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(0.4em)",
            }}
          >
            <span className="text-primary-100">{p.primary}</span> {p.rest}
          </span>
        );
      })}
    </span>
  );
}
