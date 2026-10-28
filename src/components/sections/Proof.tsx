"use client";

import {
  Cpu,
  ShieldCheck,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { CountUp } from "@/src/components/motion/CountUp";
import { Reveal } from "@/src/components/motion/Reveal";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";
import { useRafPointer } from "@/src/lib/useRafPointer";

const proofIcons: readonly LucideIcon[] = [Cpu, ShieldCheck, Zap, Terminal];

type Stat = (typeof siteContent.stats)[number];

export function Proof() {
  return (
    <section
      aria-label="Engineering proof points"
      className="relative overflow-hidden bg-surface px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {siteContent.stats.map((stat, index) => {
          const Icon = proofIcons[index];
          return (
            <Reveal
              key={stat.label}
              delay={index * 0.07}
              y={24}
              className="h-full"
            >
              <ProofCard stat={stat} Icon={Icon} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ProofCard({ stat, Icon }: { stat: Stat; Icon: LucideIcon }) {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const rotateX = useSpring(useMotionValue(0), {
    stiffness: 180,
    damping: 24,
  });
  const rotateY = useSpring(useMotionValue(0), {
    stiffness: 180,
    damping: 24,
  });
  const plainValue = "text" in stat ? stat.text : null;
  const letters = plainValue?.split("") ?? [];
  const active = preloaderComplete && !reducedMotion;
  const tiltX = useTransform(rotateX, (value) => `${value}deg`);
  const tiltY = useTransform(rotateY, (value) => `${value}deg`);

  const { onPointerMove, cancel } = useRafPointer(
    ({ clientX, clientY, pointerType }) => {
      const card = cardRef.current;
      if (!card || pointerType !== "mouse") return;

      const bounds = card.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      card.style.setProperty("--glow-x", `${x}px`);
      card.style.setProperty("--glow-y", `${y}px`);

      if (reducedMotion) return;
      const relativeX = x / bounds.width - 0.5;
      const relativeY = y / bounds.height - 0.5;
      rotateX.set(-relativeY * 12);
      rotateY.set(relativeX * 12);
    },
  );

  function resetPointer() {
    cancel();
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      whileHover={reducedMotion ? undefined : { y: -7, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: reducedMotion ? 0 : tiltX,
        rotateY: reducedMotion ? 0 : tiltY,
        transformPerspective: 850,
      }}
      className="proof-card group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-6 sm:min-h-72 sm:p-7"
    >
      <div className="relative z-[1] flex items-center justify-between">
        <p className="font-technical text-[10px] font-medium tracking-[0.16em] text-navy sm:text-xs">
          {stat.label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-full bg-surface text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-navy">
          <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
        </span>
      </div>

      <div className="relative z-[1] mt-10">
        <p className="flex min-h-[3.5rem] items-baseline text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-none tracking-[-0.06em] text-navy">
          {"value" in stat ? (
            <CountUp
              value={stat.value}
              prefix={"prefix" in stat ? stat.prefix : ""}
              suffix={stat.suffix}
              duration={1.8}
            />
          ) : (
            <span className="inline-flex" aria-label={stat.text}>
              {letters.map((letter, index) => (
                <motion.span
                  aria-hidden="true"
                  key={`${letter}-${index}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={
                    active
                      ? { opacity: 1, y: 0 }
                      : undefined
                  }
                  viewport={{ once: true }}
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.35,
                    delay: reducedMotion ? 0 : index * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="whitespace-pre"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          )}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">{stat.note}</p>
      </div>
    </motion.article>
  );
}
