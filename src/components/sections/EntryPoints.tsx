"use client";

import { useState, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { Button } from "@/src/components/ui/Button";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { siteContent } from "@/src/content/site";
import { useRafPointer } from "@/src/lib/useRafPointer";

export function EntryPoints() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const glowX = useSpring(useMotionValue(0), { stiffness: 90, damping: 24 });
  const glowY = useSpring(useMotionValue(0), { stiffness: 90, damping: 24 });

  const { onPointerMove, cancel } = useRafPointer(
    ({ clientX, clientY, pointerType }) => {
      if (reducedMotion || pointerType !== "mouse") return;
      const section = document.getElementById("entry-points");
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      glowX.set(clientX - bounds.left);
      glowY.set(clientY - bounds.top);
    },
  );

  return (
    <motion.section
      id="entry-points"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        cancel();
        glowX.set(0);
        glowY.set(0);
      }}
      style={
        {
          "--entry-glow-x": glowX,
          "--entry-glow-y": glowY,
        } as CSSProperties
      }
      className="entry-points-section relative overflow-hidden bg-navy px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16"
    >
      <div aria-hidden="true" className="entry-points-texture pointer-events-none absolute inset-0" />
      <div className="relative z-[1] mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel className="text-white/60">
              {siteContent.entryPoints.eyebrow}
            </SectionLabel>
            <h2 className="mt-5 text-display-md font-semibold leading-[0.98] tracking-[-0.06em] text-white">
              {siteContent.entryPoints.headline[0]}
              <br />
              <span className="font-editorial font-normal text-accent">
                {siteContent.entryPoints.headline[1]}
              </span>
            </h2>
          </div>
          <Button href="#how-we-work" variant="light" data-cursor="Open">
            {siteContent.entryPoints.cta}
          </Button>
        </div>

        <div className="entry-points-grid mt-14 flex flex-col border-t border-white/15 lg:mt-20 lg:flex-row">
          {siteContent.entryPoints.items.map((item, index) => {
            const active = activeIndex === index;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, ...(reducedMotion ? {} : { y: 20 }) }}
                whileInView={
                  preloaderComplete
                    ? { opacity: 1, y: 0 }
                    : undefined
                }
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0.2 : 0.65,
                  delay: reducedMotion ? 0 : index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`entry-point relative min-w-0 flex-1 border-b border-white/15 lg:flex ${
                  active ? "entry-point--active" : ""
                }`}
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`entry-point-button group relative flex min-h-64 w-full flex-col items-start px-0 py-7 text-left transition-opacity duration-500 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent lg:min-h-[25rem] lg:px-6 lg:py-8 ${
                    active ? "opacity-100" : "lg:opacity-40"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="entry-point-active-dot"
                      aria-hidden="true"
                      transition={{
                        layout: {
                          duration: reducedMotion ? 0 : 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      className="entry-point-dot absolute -top-[4px] left-0 size-2 rounded-full bg-accent"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="entry-point-dot absolute -top-[4px] left-0 size-2 rounded-full bg-accent"
                    />
                  )}
                  <span className="entry-point-number font-technical text-sm tabular-nums tracking-[0.12em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 max-w-xs text-[clamp(1.45rem,2.4vw,2.35rem)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
                    {item.title}
                  </h3>
                  <p className="entry-point-description mt-5 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base">
                    {item.description}
                  </p>
                  <span aria-hidden="true" className="entry-point-line mt-auto" />
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
