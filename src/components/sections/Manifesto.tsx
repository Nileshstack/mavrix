"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

const emphasizedPhrase = siteContent.manifesto.emphasisWords[0];
const words = siteContent.manifesto.text.split(" ");

function isEmphasizedWord(word: string) {
  const normalized = word.replace(/[.,!?;:]$/, "");
  const phrase = emphasizedPhrase.replace(/[.,!?;:]$/, "");
  return phrase.split(" ").includes(normalized);
}

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();

  useEffect(() => {
    if (reducedMotion || !preloaderComplete || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const section = sectionRef.current;
      const background = backgroundRef.current;
      const wordElements = wordRefs.current.filter(
        (word): word is HTMLSpanElement => word !== null,
      );
      if (!section || !background || wordElements.length === 0) return;

      gsap.set(wordElements, { opacity: 0.15 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        wordElements,
        {
          opacity: 1,
          duration: 1,
          stagger: 0.055,
          ease: "none",
        },
        0,
      );
      timeline.fromTo(
        background,
        { xPercent: 12 },
        { xPercent: -12, duration: 1, ease: "none" },
        0,
      );
    }, sectionRef);

    return () => context.revert();
  }, [preloaderComplete, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Manifesto"
      className="relative h-[150svh] overflow-hidden bg-navy text-white"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
        <span
          ref={backgroundRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-semibold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] text-[clamp(6rem,23vw,22rem)]"
        >
          MAVRIX
        </span>

        <h2
          aria-label={siteContent.manifesto.text}
          className="relative z-[1] mx-auto max-w-6xl text-center text-[clamp(2.4rem,7.2vw,6rem)] font-medium leading-[1.08] tracking-[-0.055em]"
        >
          {reducedMotion ? (
            <>
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={isEmphasizedWord(word) ? "font-editorial text-accent" : ""}
                >
                  {word}
                  {index < words.length - 1 ? " " : ""}
                </span>
              ))}
            </>
          ) : (
            <span aria-hidden="true">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  ref={(element) => {
                    wordRefs.current[index] = element;
                  }}
                  className={`manifesto-word inline-block ${
                    isEmphasizedWord(word) ? "font-editorial text-accent" : ""
                  }`}
                >
                  {word}
                  {index < words.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </span>
          )}
        </h2>
      </div>
    </section>
  );
}
