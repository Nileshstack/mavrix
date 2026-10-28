"use client";

import { useScroll, useVelocity } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: number;
  speedUpOnScroll?: boolean;
  label?: string;
};

export function Marquee({
  children,
  className,
  direction = "left",
  speed = 55,
  speedUpOnScroll = false,
  label = "Scrolling content",
}: MarqueeProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    const group = groupRef.current;
    const track = trackRef.current;
    if (!group || !track || reducedMotion) return;

    const updateDuration = (velocity = 0) => {
      const baseDuration = Math.max(group.scrollWidth / Math.max(speed, 1), 0.1);
      const boost = speedUpOnScroll ? 1 + Math.min(Math.abs(velocity) / 1800, 2) : 1;
      track.style.setProperty("--marquee-duration", `${baseDuration / boost}s`);
    };

    updateDuration();
    const observer = new ResizeObserver(() => updateDuration());
    observer.observe(group);
    const unsubscribe = scrollVelocity.on("change", (velocity) => updateDuration(velocity));

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [reducedMotion, scrollVelocity, speed, speedUpOnScroll]);

  return (
    <div
      className={`marquee overflow-hidden ${className ?? ""}`}
      role="region"
      aria-label={label}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max"
        style={{
          "--marquee-direction": direction === "right" ? "reverse" : "normal",
          animation: reducedMotion ? "none" : undefined,
        } as CSSProperties}
      >
        <div ref={groupRef} className="flex w-max shrink-0" aria-hidden="true">
          {children}
        </div>
        <div className="flex w-max shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
