"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Button } from "@/src/components/ui/Button";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { siteContent } from "@/src/content/site";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import {
  AutomationVisual,
  ChatbotVisual,
  GraphicDesignVisual,
  MobileVisual,
  SeoVisual,
  SoftwareVisual,
  WebsiteVisual,
} from "@/src/components/ui/visuals";

const visuals = [
  SeoVisual,
  AutomationVisual,
  ChatbotVisual,
  WebsiteVisual,
  MobileVisual,
  SoftwareVisual,
  GraphicDesignVisual,
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const activeService = siteContent.services[activeIndex];
  const ActiveVisual = visuals[activeIndex];

  function activateTab(index: number, moveFocus = false) {
    const nextIndex =
      (index + siteContent.services.length) % siteContent.services.length;
    setActiveIndex(nextIndex);
    if (moveFocus) tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = siteContent.services.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(nextIndex, true);
  }

  return (
    <section
      id="services"
      className="scroll-target overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>{siteContent.servicesSection.eyebrow}</SectionLabel>
            <h2 className="mt-5 text-display-md font-semibold leading-none tracking-[-0.06em] text-navy">
              {siteContent.servicesSection.headline[0]}{" "}
              <span className="font-editorial font-normal text-accent">
                {siteContent.servicesSection.headline[1]}
              </span>
            </h2>
          </div>
          <Button href="#contact" variant="primary" data-cursor="Open">
            {siteContent.servicesSection.cta}
          </Button>
        </div>

        <div className="mt-14 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:mt-20 xl:gap-16">
          <div
            role="tablist"
            aria-label={siteContent.servicesSection.eyebrow}
            aria-orientation="vertical"
            className="self-start lg:sticky lg:top-28"
          >
            {siteContent.services.map((service, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={service.number}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`service-tab-${service.number}`}
                  type="button"
                  role="tab"
                  data-index={index}
                  aria-selected={selected}
                  aria-controls="service-tabpanel"
                  tabIndex={selected ? 0 : -1}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`service-tab group flex w-full items-center gap-4 border-b border-line py-5 text-left transition-opacity duration-300 xl:py-6 ${
                    selected ? "is-active opacity-100" : "opacity-30 hover:opacity-70"
                  }`}
                >
                  <span className="font-technical text-xs tracking-[0.12em] text-accent">
                    {service.number}
                  </span>
                  <span className="relative flex-1 text-[clamp(2rem,3.2vw,4rem)] font-medium leading-[0.98] tracking-[-0.055em] text-ink">
                    {service.title}
                    <span className="service-tab-underline" />
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="service-tab-arrow size-5 shrink-0 text-accent"
                  />
                </button>
              );
            })}
          </div>

          <div
            id="service-tabpanel"
            role="tabpanel"
            aria-labelledby={`service-tab-${activeService.number}`}
            tabIndex={0}
            data-cursor="View"
            className="service-panel relative min-h-[38rem] overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-[0_24px_70px_rgba(10,15,31,0.07)] outline-none focus-visible:ring-2 focus-visible:ring-accent lg:sticky lg:top-28 lg:self-start xl:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeService.number}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -12 }
                }
                transition={{
                  duration: reducedMotion ? 0.18 : 0.42,
                  ease: EASE,
                }}
                className="relative z-[1] flex h-full flex-col"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-technical text-xs tracking-[0.16em] text-accent">
                    {activeService.number}
                  </span>
                  <span aria-hidden="true" className="size-2 rounded-full bg-accent shadow-[0_0_16px_rgba(61,181,255,0.8)]" />
                </div>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
                  {activeService.description}
                </p>
                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  {activeService.chips.map((chip, index) => (
                    <motion.div
                      key={chip}
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reducedMotion ? 0.18 : 0.35,
                        delay: reducedMotion ? 0 : 0.08 + index * 0.06,
                        ease: EASE,
                      }}
                      className="flex min-h-12 items-center rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-sm leading-snug text-ink/75"
                    >
                      {chip}
                    </motion.div>
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="mt-auto flex min-h-48 items-center justify-center pt-7"
                >
                  <ActiveVisual />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 space-y-3 lg:hidden">
          {siteContent.services.map((service, index) => {
            const expanded = openAccordion === index;
            const Visual = visuals[index];
            return (
              <article
                key={service.number}
                className="overflow-hidden rounded-2xl border border-line bg-surface"
              >
                <h3>
                  <button
                    type="button"
                    id={`service-accordion-trigger-${service.number}`}
                    aria-expanded={expanded}
                    aria-controls={`service-accordion-panel-${service.number}`}
                    onClick={() =>
                      setOpenAccordion(expanded ? null : index)
                    }
                    className="flex w-full items-center gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent"
                  >
                    <span className="font-technical text-[10px] tracking-wider text-accent">
                      {service.number}
                    </span>
                    <span className="flex-1 text-lg font-medium leading-tight tracking-tight text-navy">
                      {service.title}
                    </span>
                    <motion.span
                      animate={{
                        rotate: reducedMotion ? 0 : expanded ? 90 : 0,
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.22, ease: EASE }}
                    >
                      <ArrowDownRight aria-hidden="true" className="size-5 text-accent" />
                    </motion.span>
                  </button>
                </h3>
                <div
                  id={`service-accordion-panel-${service.number}`}
                  role="region"
                  aria-labelledby={`service-accordion-trigger-${service.number}`}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  className="overflow-hidden"
                >
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                        transition={{
                          duration: reducedMotion ? 0.15 : 0.24,
                          ease: EASE,
                        }}
                      >
                          <div className="px-4 pb-5">
                            <p className="text-sm leading-relaxed text-ink/75">
                              {service.description}
                            </p>
                            <ul className="mt-4 grid gap-2">
                              {service.chips.map((chip) => (
                                <li
                                  key={chip}
                                  className="rounded-lg border border-white/80 bg-white/70 px-3 py-2 text-sm text-ink/75"
                                >
                                  {chip}
                                </li>
                              ))}
                            </ul>
                            <div
                              aria-hidden="true"
                              className="mx-auto mt-5 flex h-32 max-w-[13rem] items-center justify-center"
                            >
                              <Visual />
                            </div>
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
