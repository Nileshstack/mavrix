"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { Magnetic } from "@/src/components/motion/Magnetic";
import { Reveal } from "@/src/components/motion/Reveal";
import { SplitText } from "@/src/components/motion/SplitText";
import { useLenis } from "@/src/components/motion/SmoothScroll";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { Button } from "@/src/components/ui/Button";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { siteContent } from "@/src/content/site";

const BlueprintCanvas = dynamic(() => import("./BlueprintCanvas"), {
  ssr: false,
});

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const heroVisible = useInView(heroRef);
  const [finePointer, setFinePointer] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const gearRotation = useMotionValue(0);
  const gearX = useSpring(useMotionValue(0), { stiffness: 80, damping: 22 });
  const gearY = useSpring(useMotionValue(0), { stiffness: 80, damping: 22 });
  const cardRotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const cardRotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const cardFloatY = useMotionValue(0);
  const pointerFrame = useRef(0);
  const pendingPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointer = () => setFinePointer(pointer.matches);
    const frame = window.requestAnimationFrame(updatePointer);
    pointer.addEventListener("change", updatePointer);
    return () => {
      window.cancelAnimationFrame(frame);
      pointer.removeEventListener("change", updatePointer);
    };
  }, []);

  useEffect(
    () => () => window.cancelAnimationFrame(pointerFrame.current),
    [],
  );

  useEffect(() => {
    if (reducedMotion || !preloaderComplete || !finePointer || !heroVisible) return;
    let frame = 0;
    let previousTime = 0;
    const animateDecorations = (time: number) => {
      const delta = previousTime === 0 ? 0 : time - previousTime;
      previousTime = time;
      const scrollBoost = Math.min(Math.abs(scrollVelocity.get()) / 1800, 3);
      gearRotation.set(gearRotation.get() + delta * (0.025 + scrollBoost * 0.045));
      cardFloatY.set(Math.sin(time / 1200) * 4);
      frame = window.requestAnimationFrame(animateDecorations);
    };
    frame = window.requestAnimationFrame(animateDecorations);
    return () => window.cancelAnimationFrame(frame);
  }, [
    cardFloatY,
    finePointer,
    gearRotation,
    preloaderComplete,
    reducedMotion,
    scrollVelocity,
    heroVisible,
  ]);

  const lineIndexRef = useRef(0);
  const characterIndexRef = useRef(0);

  useEffect(() => {
    if (reducedMotion || !preloaderComplete || !heroVisible) return;
    let timeout = 0;
    const typeLine = () => {
      const lineIndex = lineIndexRef.current;
      let characterIndex = characterIndexRef.current;
      const currentLine = siteContent.hero.systemLogs[lineIndex];
      characterIndex += 1;
      characterIndexRef.current = characterIndex;
      setLines((visible) => {
        const next = [...visible];
        next[lineIndex] = currentLine.slice(0, characterIndex);
        return next;
      });

      if (characterIndex < currentLine.length) {
        timeout = window.setTimeout(typeLine, 28);
        return;
      }

      timeout = window.setTimeout(() => {
        lineIndexRef.current += 1;
        characterIndexRef.current = 0;
        if (lineIndexRef.current >= siteContent.hero.systemLogs.length) {
          timeout = window.setTimeout(() => {
            lineIndexRef.current = 0;
            setLines([]);
            timeout = window.setTimeout(typeLine, 260);
          }, 1200);
          return;
        }
        typeLine();
      }, 520);
    };

    timeout = window.setTimeout(typeLine, 500);
    return () => window.clearTimeout(timeout);
  }, [heroVisible, preloaderComplete, reducedMotion]);
  const visibleLines = reducedMotion ? siteContent.hero.systemLogs : lines;

  
  const scrollTo = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis && !reducedMotion) {
        lenis.scrollTo(target, { offset: -90 });
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? "instant" : "smooth",
          block: "start",
        });
      }
    },
    [lenis, reducedMotion],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      reducedMotion ||
      !finePointer ||
      !preloaderComplete ||
      event.pointerType !== "mouse" ||
      !heroRef.current
    ) return;
    pendingPointer.current = { x: event.clientX, y: event.clientY };
    if (pointerFrame.current) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const bounds = heroRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const normalizedX = (pendingPointer.current.x - bounds.left) / bounds.width - 0.5;
      const normalizedY = (pendingPointer.current.y - bounds.top) / bounds.height - 0.5;
      gearX.set(normalizedX * 18);
      gearY.set(normalizedY * 14);

      const cardBounds = heroRef.current
        ?.querySelector<HTMLElement>("[data-system-card]")
        ?.getBoundingClientRect();
      if (cardBounds) {
        const cardX = (pendingPointer.current.x - cardBounds.left) / cardBounds.width - 0.5;
        const cardY = (pendingPointer.current.y - cardBounds.top) / cardBounds.height - 0.5;
        cardRotateX.set(Math.max(-0.5, Math.min(0.5, -cardY * 8)));
        cardRotateY.set(Math.max(-0.5, Math.min(0.5, cardX * 10)));
      }
    });
  };

  const handlePointerLeave = () => {
    window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    gearX.set(0);
    gearY.set(0);
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`hero-section relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-white px-6 pb-44 pt-32 sm:px-10 sm:pb-48 lg:px-16 ${
        preloaderComplete
          ? `hero-section--ready${heroVisible ? " hero-section--visible" : ""}`
          : ""
      }`}
    >
      <BlueprintCanvas parentRef={heroRef} active={preloaderComplete} />
      <div aria-hidden="true" className="hero-blob hero-blob-one" />
      <div aria-hidden="true" className="hero-blob hero-blob-two" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] top-[18%] z-[1] hidden sm:block"
        style={{ x: gearX, y: gearY, rotate: gearRotation }}
      >
        <GearMark />
      </motion.div>

      <motion.div
        className="relative z-[2] mx-auto w-full max-w-7xl"
        style={{
          y: reducedMotion ? 0 : contentY,
          opacity: reducedMotion ? 1 : contentOpacity,
        }}
      >
        <Reveal delay={0.05}>
          <SectionLabel>{siteContent.hero.eyebrow}</SectionLabel>
        </Reveal>

        <h1
          aria-label={siteContent.hero.headline.join(" ")}
          className="mt-7 w-full max-w-none text-[clamp(3.5rem,9.8vw,10rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-navy sm:mt-9"
        >
          <SplitText
            as="span"
            className="hero-heading-line block"
            text={siteContent.hero.headline[0]}
            mode="lines"
            delay={0.08}
            stagger={0.06}
          />
          <SplitText
            as="span"
            className="hero-shimmer font-editorial block font-normal tracking-[-0.065em] text-accent"
            text={siteContent.hero.headline[1]}
            mode="lines"
            delay={0.28}
            stagger={0.075}
          />
        </h1>

        <Reveal delay={0.35} y={22}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink/75 sm:mt-8 sm:text-lg">
            {siteContent.hero.sub}
          </p>
        </Reveal>

        <Reveal delay={0.48} y={18}>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <Magnetic radius={130} strength={0.18}>
              <Button
                href="#services"
                onClick={scrollTo("services")}
                data-cursor="Open"
              >
                {siteContent.hero.ctas[0]}
              </Button>
            </Magnetic>
            <Button
              href="#contact"
              onClick={scrollTo("contact")}
              variant="outline"
              data-cursor="Open"
            >
              {siteContent.hero.ctas[1]}
            </Button>
          </div>
        </Reveal>
      </motion.div>

      <div className="pointer-events-none absolute bottom-7 left-6 z-[2] flex items-center gap-3 sm:bottom-10 sm:left-10 lg:left-16">
        <span className="hero-scroll-line relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent" />
        </span>
        <span className="font-technical text-[10px] tracking-[0.2em] text-ink/60">
          {siteContent.hero.scrollCue}
        </span>
        <ArrowDown aria-hidden="true" size={13} className="text-accent" />
      </div>

      <SystemCard
        lines={visibleLines}
        rotateX={cardRotateX}
        rotateY={cardRotateY}
        floatY={cardFloatY}
      />
    </section>
  );
}

function GearMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className="size-20 text-accent drop-shadow-[0_12px_30px_rgba(61,181,255,0.2)] lg:size-28"
      fill="none"
    >
      <path
        fill="currentColor"
        d="M51 3h18l3.2 12.6a46 46 0 0 1 9.6 4l11.2-6.6 12.7 12.7-6.6 11.2a46 46 0 0 1 4 9.6L116 50v18l-12.6 3.2a46 46 0 0 1-4 9.6l6.6 11.2-12.7 12.7-11.2-6.6a46 46 0 0 1-9.6 4L69 115H51l-3.2-12.6a46 46 0 0 1-9.6-4L27 105l-12.7-12.7 6.6-11.2a46 46 0 0 1-4-9.6L4 68V50l12.6-3.2a46 46 0 0 1 4-9.6L14 26l12.7-12.7 11.2 6.6a46 46 0 0 1 9.6-4L51 3Z"
      />
      <circle cx="60" cy="59" r="20" fill="white" />
      <circle cx="60" cy="59" r="8" fill="#3DB5FF" />
    </svg>
  );
}

function SystemCard({
  lines,
  rotateX,
  rotateY,
  floatY,
}: {
  lines: readonly string[];
  rotateX: ReturnType<typeof useMotionValue<number>>;
  rotateY: ReturnType<typeof useMotionValue<number>>;
  floatY: ReturnType<typeof useMotionValue<number>>;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.aside
      data-system-card
      aria-label={siteContent.hero.systemCardTitle}
      className="hero-system-card absolute bottom-6 right-5 z-[3] w-[min(21rem,calc(100%-2.5rem))] overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-navy/10 backdrop-blur-xl sm:bottom-9 sm:right-10 sm:p-5 lg:bottom-48 lg:right-16"
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        y: reducedMotion ? 0 : floatY,
        transformPerspective: 900,
      }}
    >
      <div className="mb-3 flex items-center justify-between border-b border-line/80 pb-3">
        <span className="font-technical text-[9px] tracking-[0.16em] text-ink/55">
          {siteContent.hero.systemCardTitle}
        </span>
        <span className="flex items-center gap-2 font-technical text-[9px] text-emerald-700">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
          {siteContent.hero.systemStatus}
        </span>
      </div>
      <div
        className="min-h-[5.2rem] space-y-1.5 font-technical text-[10px] leading-relaxed text-navy sm:text-[11px]"
      >
        {lines.map((line, index) => (
          <p key={`${index}-${line}`} className="truncate">
            {line}
          </p>
        ))}
        <span
          aria-hidden="true"
          className="hero-caret inline-block h-3 w-px bg-accent align-middle"
        />
      </div>
    </motion.aside>
  );
}
