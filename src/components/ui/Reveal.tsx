"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** ms delay applied once the element enters the viewport, for staggering groups */
  delay?: number;
  direction?: "up" | "none" | "left" | "right";
};

export function Reveal({ children, className, delay = 0, direction = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden = {
    up: "opacity-0 translate-y-10",
    left: "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
    none: "opacity-0",
  }[direction];

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        visible ? "opacity-100 translate-x-0 translate-y-0" : hidden,
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
