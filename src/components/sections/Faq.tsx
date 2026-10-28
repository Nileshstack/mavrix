"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { Button } from "@/src/components/ui/Button";
import { siteContent } from "@/src/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();

  return (
    <section
      id="faq"
      className="scroll-target bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 font-technical text-xs uppercase tracking-[0.16em] text-ink/70">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {siteContent.faqSection.eyebrow}
            </p>
            <h2 className="mt-5 text-display-md font-semibold leading-[0.98] tracking-[-0.06em] text-navy">
              {siteContent.faqSection.headline[0]}
              <br />
              <span className="font-editorial font-normal text-accent">
                {siteContent.faqSection.headline[1]}
              </span>
            </h2>
          </div>
          <Button href="#contact" variant="primary" data-cursor="Open">
            {siteContent.faqSection.cta}
          </Button>
        </div>

        <div className="mt-12 grid items-start gap-4 md:grid-cols-2 lg:mt-16">
          {siteContent.faq.map((item, index) => {
            const open = openIndex === index;
            const itemNumber = String(index + 1).padStart(2, "0");
            const panelId = `faq-answer-${itemNumber}`;
            const triggerId = `faq-question-${itemNumber}`;

            return (
              <motion.article
                key={item.question}
                initial={{
                  opacity: 0,
                  ...(reducedMotion ? {} : { y: 18 }),
                }}
                whileInView={
                  preloaderComplete ? { opacity: 1, y: 0 } : undefined
                }
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0.2 : 0.6,
                  delay: reducedMotion ? 0 : index * 0.06,
                  ease: EASE,
                }}
                className="faq-card rounded-2xl border border-line bg-white p-5 sm:p-7"
              >
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-start gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <span className="flex-1 text-lg font-semibold leading-snug tracking-[-0.025em] text-navy sm:text-xl">
                      {item.question}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.28,
                        ease: EASE,
                      }}
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-navy"
                    >
                      <Plus className="size-4" />
                    </motion.span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!open}
                  inert={!open}
                  className="overflow-hidden"
                >
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                        transition={{
                          duration: reducedMotion ? 0.15 : 0.28,
                          ease: EASE,
                        }}
                      >
                        <p className="max-w-2xl pt-5 text-sm leading-relaxed text-ink/70 sm:text-base">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-technical text-[9px] uppercase tracking-[0.13em] text-ink/45">
                    {siteContent.faqSection.itemLabel} {itemNumber}
                  </span>
                  <span className="flex items-center gap-2 font-technical text-[9px] tracking-[0.12em] text-[#318c70]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#56c39a]" />
                    {siteContent.faqSection.verifiedLabel}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
