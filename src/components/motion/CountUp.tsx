"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "./useReducedMotion";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.8,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const formattedCount = useTransform(
    count,
    (current) => `${prefix}${Math.round(current).toLocaleString()}${suffix}`,
  );
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();

  useEffect(() => {
    if (reducedMotion) {
      count.set(value);
      return;
    }
    if (!isInView || !preloaderComplete) return;

    const animation = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => animation.stop();
  }, [count, duration, isInView, preloaderComplete, reducedMotion, value]);

  return (
    <motion.span ref={ref} className={className}>
      {formattedCount}
    </motion.span>
  );
}
