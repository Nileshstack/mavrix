"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { useLenis } from "@/src/components/motion/SmoothScroll";
import { siteContent } from "@/src/content/site";

const PreloaderContext = createContext(false);
const SESSION_KEY = "mavrix-preloader-complete";

export function usePreloaderComplete() {
  return useContext(PreloaderContext);
}

export function Preloader({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const [complete, setComplete] = useState(false);
  const [active, setActive] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (value) => Math.round(value).toString());

  useEffect(() => {
    let controls: ReturnType<typeof animate> | undefined;
    const frame = window.requestAnimationFrame(() => {
      if (
        reducedMotion ||
        window.sessionStorage.getItem(SESSION_KEY) === "true"
      ) {
        setActive(false);
        setComplete(true);
        return;
      }

      setActive(true);
      controls = animate(progress, 100, {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => setCurtain(true),
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      controls?.stop();
    };
  }, [progress, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [active, lenis]);

  function finish() {
    window.sessionStorage.setItem(SESSION_KEY, "true");
    setActive(false);
    setComplete(true);
  }

  return (
    <PreloaderContext.Provider value={complete}>
      {children}
      {active && (
        <motion.div
          role="status"
          aria-label={`Loading ${siteContent.brand.name}`}
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy text-white"
          initial={{ y: "0%" }}
          animate={curtain ? { y: "-100%" } : { y: "0%" }}
          transition={
            curtain
              ? { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (curtain) finish();
          }}
        >
          <div className="flex flex-col items-center gap-8">
            <svg
              aria-hidden="true"
              className="size-20"
              fill="none"
              viewBox="0 0 80 80"
            >
              <rect width="80" height="80" rx="22" fill="#3DB5FF" />
              <path
                d="M19 58V22h9l12 18 12-18h9v36h-9V37L40 54 28 37v21h-9Z"
                fill="#0A0F1F"
              />
            </svg>
            <div className="font-technical text-2xl tabular-nums tracking-[0.2em]">
              <motion.span>{counter}</motion.span>
              <span className="text-accent">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </PreloaderContext.Provider>
  );
}
