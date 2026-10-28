"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/src/components/motion/Marquee";
import { Magnetic } from "@/src/components/motion/Magnetic";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";
import { useRef } from "react";
import { useRafPointer } from "@/src/lib/useRafPointer";

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const shapeX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const shapeY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [8, -8]);

  const { onPointerMove, cancel } = useRafPointer(
    ({ clientX, clientY, pointerType }) => {
      if (reducedMotion || pointerType !== "mouse") return;
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const x = (clientX - bounds.left) / bounds.width - 0.5;
      const y = (clientY - bounds.top) / bounds.height - 0.5;
      shapeX.set(x * 18);
      shapeY.set(y * 14);
    },
  );

  function resetShapes() {
    cancel();
    shapeX.set(0);
    shapeY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="final-cta-section relative isolate overflow-hidden bg-accent px-6 py-24 text-navy sm:px-10 sm:py-32 lg:px-16"
      onPointerMove={onPointerMove}
      onPointerLeave={resetShapes}
    >
      <div aria-hidden="true" className="final-cta-marquees pointer-events-none absolute inset-0 flex flex-col justify-center gap-1">
        <Marquee
          direction="left"
          speed={18}
          label="Build, ship and scale"
          className="final-cta-marquee"
        >
          <span className="final-cta-marquee-text">{siteContent.finalCta.marquee}</span>
        </Marquee>
        <Marquee
          direction="right"
          speed={22}
          label="Build, ship and scale"
          className="final-cta-marquee"
        >
          <span className="final-cta-marquee-text">{siteContent.finalCta.marquee}</span>
        </Marquee>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ x: reducedMotion ? 0 : shapeX, y: reducedMotion ? 0 : shapeY }}
        className="final-cta-shape final-cta-shape-one pointer-events-none absolute"
      >
        <svg viewBox="0 0 120 120" fill="none" className="size-full">
          <circle cx="60" cy="60" r="44" stroke="white" strokeOpacity=".36" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="28" stroke="white" strokeOpacity=".24" strokeWidth="1.5" />
        </svg>
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x: reducedMotion ? 0 : shapeX, y: reducedMotion ? 0 : shapeY }}
        className="final-cta-shape final-cta-shape-two pointer-events-none absolute"
      >
        <svg viewBox="0 0 120 120" fill="none" className="size-full">
          <path
            d="M60 7 70 27l22-8-4 23 22 9-18 15 11 22-24-1-10 22-13-20-23 8 4-24-21-10 19-14-10-23 23 2L60 7Z"
            stroke="white"
            strokeOpacity=".34"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>

      <motion.div
        style={{ y: reducedMotion ? 0 : contentY }}
        className="relative z-[1] mx-auto flex max-w-7xl flex-col items-center text-center"
      >
        <h2 className="text-[clamp(3.75rem,10vw,9rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
          {siteContent.finalCta.headline[0]}
          <br />
          <span className="font-editorial font-normal text-white">
            {siteContent.finalCta.headline[1]}
          </span>
        </h2>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-navy/75 sm:text-lg">
          {siteContent.finalCta.sub}
        </p>
        <Magnetic radius={150} strength={0.18} className="mt-8">
          <a
            href="#contact"
            data-cursor="Open"
            className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-semibold text-navy shadow-[0_12px_35px_rgba(10,15,31,0.12)] transition-shadow hover:shadow-[0_18px_45px_rgba(10,15,31,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
          >
            {siteContent.finalCta.button}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </Magnetic>
      </motion.div>
    </section>
  );
}
