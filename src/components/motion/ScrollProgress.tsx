"use client";

import { motion, useScroll } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
