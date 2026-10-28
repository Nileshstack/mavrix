"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePreloaderComplete } from "./Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";

type CursorTarget = {
  label: string;
  interactive: boolean;
};

const EMPTY_CURSOR: CursorTarget = { label: "", interactive: false };

function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return finePointer;
}

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const finePointer = useFinePointer();
  const [target, setTarget] = useState(EMPTY_CURSOR);
  const targetRef = useRef(EMPTY_CURSOR);
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.6 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.6 });
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const active = finePointer && !reducedMotion && preloaderComplete;

  useEffect(() => {
    if (!active) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }
    document.documentElement.classList.add("custom-cursor-active");

    let frame = 0;
    let pointerX = -100;
    let pointerY = -100;
    const updatePosition = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        dotX.set(pointerX);
        dotY.set(pointerY);
        x.set(pointerX);
        y.set(pointerY);
      });
    };
    const updateTarget = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const targetElement = element?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      const nextTarget = {
        label: targetElement?.dataset.cursor ?? "",
        interactive: Boolean(targetElement),
      };
      if (
        targetRef.current.label === nextTarget.label &&
        targetRef.current.interactive === nextTarget.interactive
      ) return;
      targetRef.current = nextTarget;
      setTarget(nextTarget);
    };
    const updatePointerTarget = (event: PointerEvent) => {
      const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      const element = related?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      const nextTarget = {
        label: element?.dataset.cursor ?? "",
        interactive: Boolean(element),
      };
      if (
        targetRef.current.label === nextTarget.label &&
        targetRef.current.interactive === nextTarget.interactive
      ) return;
      targetRef.current = nextTarget;
      setTarget(nextTarget);
    };

    window.addEventListener("pointermove", updatePosition, { passive: true });
    document.addEventListener("pointerover", updateTarget, { passive: true });
    document.addEventListener("pointerout", updatePointerTarget, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", updatePosition);
      document.removeEventListener("pointerover", updateTarget);
      document.removeEventListener("pointerout", updatePointerTarget);
    };
  }, [active, dotX, dotY, x, y]);

  if (!active) return null;

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x: dotX, y: dotY }}
      />
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[89] flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent text-[10px] font-medium text-navy ${
          target.label ? "bg-accent" : "bg-transparent"
        }`}
        animate={{
          scale: target.label ? 2.1 : target.interactive ? 1.45 : 1,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{ x, y }}
      >
        {target.label}
      </motion.span>
    </>
  );
}
