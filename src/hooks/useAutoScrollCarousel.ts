"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Infinite auto-scrolling drag carousel — shared by Testimonial and UpcomingEvents.
 *
 * The caller renders the item list twice (`[...items, ...items]`) and tags each rendered
 * card with `data-card` so this hook can find them. The track sits at the scroll midpoint by
 * default, so drift in either direction wraps between 0 and the midpoint invisibly, because
 * the two halves are identical.
 */
export function useAutoScrollCarousel(itemCount: number, pxPerSecond = 40) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverRef = useRef(false);
  const interactRef = useRef(false);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // A single item isn't duplicated by the caller (nothing to loop), so there's no
    // second half to drift/wrap toward — auto-scrolling here would just make the one
    // card jitter against its own width instead of sitting still.
    if (itemCount <= 1) return;

    const initPos = () => {
      track.scrollLeft = track.scrollWidth / 2;
    };
    initPos();
    window.addEventListener("resize", initPos);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const paused = hoverRef.current || interactRef.current;
      if (!paused && !mql.matches) {
        // Increasing scrollLeft makes content slide leftward.
        track.scrollLeft += pxPerSecond * dt;
      }

      const half = track.scrollWidth / 2;
      if (track.scrollLeft < 0) track.scrollLeft += half;
      else if (track.scrollLeft >= half) track.scrollLeft -= half;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", initPos);
    };
  }, [pxPerSecond, itemCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pending = false;

    const update = () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-card]"),
      );
      if (!cards.length) return;
      const tr = track.getBoundingClientRect();
      const center = tr.left + tr.width / 2;
      let closest = 0;
      let min = Infinity;
      cards.forEach((card, i) => {
        const cr = card.getBoundingClientRect();
        const cardCenter = cr.left + cr.width / 2;
        const d = Math.abs(cardCenter - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActiveIndex(closest % itemCount);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        update();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => track.removeEventListener("scroll", onScroll);
  }, [itemCount]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't capture the pointer when the press starts on a link/button inside a card —
    // setPointerCapture retargets the subsequent click to the track, silently swallowing
    // taps on things like the "View course info" link before they can navigate.
    if ((e.target as HTMLElement).closest("a, button")) return;

    interactRef.current = true;
    if (e.pointerType === "mouse") {
      const track = trackRef.current;
      if (!track) return;
      dragRef.current = { startX: e.clientX, startScroll: track.scrollLeft };
      track.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !trackRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    trackRef.current.scrollLeft = dragRef.current.startScroll - dx;
  };

  const endInteraction = (e: React.PointerEvent<HTMLDivElement>) => {
    interactRef.current = false;
    if (dragRef.current && trackRef.current) {
      trackRef.current.releasePointerCapture?.(e.pointerId);
    }
    dragRef.current = null;
  };

  return {
    trackRef,
    activeIndex,
    trackProps: {
      onMouseEnter: () => {
        hoverRef.current = true;
      },
      onMouseLeave: () => {
        hoverRef.current = false;
      },
      onPointerDown,
      onPointerMove,
      onPointerUp: endInteraction,
      onPointerCancel: endInteraction,
    },
  };
}
