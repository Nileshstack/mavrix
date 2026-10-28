"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "./useReducedMotion";

type RevealProps = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "transition"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();

  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, ...(reducedMotion ? {} : { y }) }}
      whileInView={preloaderComplete ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once }}
      transition={{
        duration: reducedMotion ? 0.25 : 0.7,
        delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
