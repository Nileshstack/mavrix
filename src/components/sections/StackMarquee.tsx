"use client";

import { Marquee } from "@/src/components/motion/Marquee";
import { siteContent } from "@/src/content/site";

const stackRows = [
  siteContent.stack.marqueeItems.filter((_, index) => index % 2 === 0),
  siteContent.stack.marqueeItems.filter((_, index) => index % 2 === 1),
] as const;

function StackCell({ item }: { item: string }) {
  const [name, subtitle] = item.split(" / ");

  return (
    <div className="stack-cell mx-2 flex min-w-64 flex-col justify-center gap-1 rounded-xl border border-line bg-white px-6 py-5 sm:min-w-72 sm:px-7">
      <span className="text-sm font-semibold uppercase tracking-[0.04em] text-navy sm:text-base">
        {name}
      </span>
      <span className="font-technical text-[10px] tracking-wide text-ink/50 sm:text-xs">
        {subtitle}
      </span>
    </div>
  );
}

export function StackMarquee() {
  return (
    <section
      id="stack"
      className="scroll-target overflow-hidden bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto mb-10 flex max-w-7xl items-center gap-4 px-6 sm:mb-14 sm:px-10 lg:px-16">
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <p className="text-center font-technical text-[10px] uppercase tracking-[0.13em] text-ink/65 sm:text-xs sm:tracking-[0.16em]">
          {siteContent.stack.eyebrow}
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      <div className="stack-marquee-rows flex flex-col gap-3 sm:gap-4">
        {stackRows.map((row, rowIndex) => (
          <Marquee
            key={rowIndex}
            direction={rowIndex === 0 ? "left" : "right"}
            speed={48}
            speedUpOnScroll
            label={`Technology row ${rowIndex + 1}`}
            className="stack-marquee"
          >
            {row.map((item) => (
              <StackCell key={item} item={item} />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
