"use client";

import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/motion/Reveal";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

function StageCard({
  stage,
  active,
  index,
}: {
  stage: (typeof siteContent.delivery.stages)[number];
  active?: boolean;
  index: number;
}) {
  return (
    <article
      className={`delivery-card relative flex min-h-[25rem] flex-col overflow-hidden rounded-[1.75rem] border bg-white p-6 sm:min-h-[28rem] sm:p-8 ${
        active
          ? "delivery-card--active border-accent"
          : "border-line"
      }`}
    >
      <span className="font-technical text-[10px] tracking-[0.16em] text-accent sm:text-xs">
        STAGE {stage.number}
      </span>
      <h3 className="mt-8 max-w-sm text-[clamp(1.7rem,2.7vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.05em] text-navy">
        {stage.title}
      </h3>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65 sm:text-base">
        {stage.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
        <span className="font-technical text-[9px] tracking-[0.12em] text-ink/50 sm:text-[10px]">
          Phase {stage.number} / 05
        </span>
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            active ? "bg-accent shadow-[0_0_14px_rgba(61,181,255,0.75)]" : "bg-line"
          }`}
        />
      </div>
      <span
        aria-hidden="true"
        className="delivery-card-number pointer-events-none absolute -bottom-9 -right-2 font-semibold leading-none text-navy/[0.035]"
      >
        {stage.number}
      </span>
      <span
        aria-hidden="true"
        className="delivery-card-accent absolute bottom-0 left-0 h-1 origin-left bg-accent"
      />
      <span className="sr-only">Stage {index + 1} of 5</span>
    </article>
  );
}

export function Delivery() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWide, setIsWide] = useState(false);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const shouldPin = isWide && !reducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsWide(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    window.addEventListener("resize", updateViewport, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (
      !shouldPin ||
      !preloaderComplete ||
      !section ||
      !viewport ||
      !track ||
      !progress
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    activeIndexRef.current = 0;
    setActiveIndex(0);

    let disposed = false;
    let refreshFrame = 0;
    const context = gsap.context(() => {
      gsap.to(track, {
        xPercent: () =>
          ((viewport.clientWidth - track.scrollWidth) / track.scrollWidth) * 100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(track.scrollWidth - viewport.clientWidth, 1)}`,
          pin: section,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progress.style.transform = `scaleX(${self.progress})`;
            const centerX = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
            let nearestIndex = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;

            track.querySelectorAll<HTMLElement>("[data-delivery-card]").forEach(
              (card, index) => {
                const bounds = card.getBoundingClientRect();
                const distance = Math.abs(bounds.left + bounds.width / 2 - centerX);
                if (distance < nearestDistance) {
                  nearestDistance = distance;
                  nearestIndex = index;
                }
              },
            );

            if (activeIndexRef.current !== nearestIndex) {
              activeIndexRef.current = nearestIndex;
              setActiveIndex(nearestIndex);
            }
          },
        },
      });

      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      void document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      context.revert();
      activeIndexRef.current = 0;
    };
  }, [preloaderComplete, shouldPin]);

  const activeStage = siteContent.delivery.stages[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      className={`scroll-target relative bg-surface px-6 py-24 sm:px-10 sm:py-32 lg:px-16 ${
        shouldPin ? "delivery-pinned min-h-svh" : ""
      }`}
    >
      <div
        className={`mx-auto max-w-7xl ${
          shouldPin ? "delivery-pinned-content flex min-h-svh flex-col justify-center" : ""
        }`}
      >
        <div className="relative z-[1] flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 font-technical text-xs uppercase tracking-[0.16em] text-ink/70">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {siteContent.delivery.eyebrow}
            </p>
            <h2 className="mt-5 text-display-md font-semibold leading-[0.98] tracking-[-0.06em] text-navy">
              {siteContent.delivery.headline[0]}
              <br />
              <span className="font-editorial font-normal text-accent">
                {siteContent.delivery.headline[1]}
              </span>
            </h2>
          </div>
          <Button href="#entry-points" variant="primary" data-cursor="Open">
            {siteContent.delivery.cta}
          </Button>
        </div>

        {shouldPin ? (
          <div className="relative mt-10 min-w-0 lg:mt-12">
            <div className="delivery-stage-backdrop pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeStage.number}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-semibold leading-none tracking-[-0.08em] text-navy/[0.045]"
                >
                  {activeStage.number}
                </motion.span>
              </AnimatePresence>
            </div>
            <div ref={viewportRef} className="delivery-stage-viewport relative z-[1] overflow-hidden">
              <motion.div
                ref={trackRef}
                className="delivery-stage-track flex w-max items-stretch gap-5 py-4"
              >
                {siteContent.delivery.stages.map((stage, index) => (
                  <motion.div
                    key={stage.number}
                    data-delivery-card
                    animate={{ scale: activeIndex === index ? 1 : 0.94 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="delivery-stage-item w-[min(74vw,34rem)] shrink-0"
                  >
                    <StageCard stage={stage} index={index} active={activeIndex === index} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="relative z-[1] mt-5 h-px w-full bg-navy/10">
              <span
                ref={progressRef}
                aria-hidden="true"
                className="delivery-progress-fill absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent"
              />
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
            {siteContent.delivery.stages.map((stage, index) => (
              <Reveal
                key={stage.number}
                delay={index * 0.06}
                className="h-full"
              >
                <StageCard stage={stage} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
