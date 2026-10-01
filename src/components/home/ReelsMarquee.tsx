"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";

const SPEED_PX_PER_SECOND = 40;
// Horizontal padding (px-4 on each side) around the static row.
const STATIC_GUTTER_PX = 32;

// Lays the items out in a centered row. When they don't fit the viewport, the
// row is duplicated and scrolls in a seamless loop (paused on hover/focus).
// Users who prefer reduced motion get a manually scrollable row instead.
export function ReelsMarquee({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    if (!viewport || !set) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const width = set.scrollWidth;
      const overflows = width > viewport.clientWidth - STATIC_GUTTER_PX;
      setDuration(overflows && !reducedMotion.matches ? width / SPEED_PX_PER_SECOND : null);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(set);
    reducedMotion.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", measure);
    };
  }, []);

  const animating = duration !== null;
  // The trailing padding equals the gap, so two copies loop without a seam.
  const setClass = clsx("flex shrink-0 gap-5", animating && "pr-5");

  return (
    <div
      ref={viewportRef}
      className={clsx("py-3", animating ? "overflow-hidden" : "snap-x snap-mandatory overflow-x-auto")}
    >
      <div
        className={clsx("flex w-max", animating ? "animate-marquee" : "mx-auto px-4")}
        style={animating ? { animationDuration: `${duration}s` } : undefined}
      >
        <div ref={setRef} className={setClass}>
          {children}
        </div>
        {animating && (
          <div aria-hidden inert className={setClass}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
