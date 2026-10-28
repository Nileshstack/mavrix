"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { useRafPointer } from "@/src/lib/useRafPointer";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
};

export function Magnetic({
  children,
  className,
  radius = 120,
  strength = 0.22,
}: MagneticProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const { onPointerMove, cancel } = useRafPointer(
    ({ clientX, clientY, pointerType }) => {
      if (reducedMotion || pointerType !== "mouse" || !ref.current) return;

      const bounds = ref.current.getBoundingClientRect();
      const dx = clientX - (bounds.left + bounds.width / 2);
      const dy = clientY - (bounds.top + bounds.height / 2);

      if (Math.hypot(dx, dy) > radius) {
        x.set(0);
        y.set(0);
        return;
      }

      x.set(dx * strength);
      y.set(dy * strength);
    },
  );

  function handlePointerLeave() {
    cancel();
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}
