"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLenis } from "@/src/components/motion/SmoothScroll";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

const sectionLinks = [
  { label: siteContent.nav.items[0], href: "#services" },
  { label: siteContent.nav.items[1], href: "#how-we-work" },
  { label: siteContent.nav.items[2], href: "#stack" },
  { label: siteContent.nav.items[3], href: "#faq" },
  { label: siteContent.nav.items[4], href: "#contact" },
] as const;

function RollLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="footer-roll-link group relative inline-flex min-h-7 items-center overflow-hidden text-sm text-white/65 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-full transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full"
      >
        {children}
      </span>
      {external && <ArrowUpRight aria-hidden="true" className="ml-1 size-3.5" />}
    </a>
  );
}

export function Footer() {
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const revealTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: revealTrackRef,
    offset: ["start end", "end start"],
  });
  const wordmarkScale = useTransform(
    scrollYProgress,
    [0.12, 0.88],
    [0, 1],
  );

  function backToTop() {
    if (lenis && !reducedMotion) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    }
  }

  const instagramIsConfigured =
    siteContent.contact.instagramUrl !== "TODO";

  return (
    <>
      <footer className="site-footer fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-navy text-white">
        <div className="mx-auto flex h-full max-w-[90rem] flex-col justify-between px-6 pb-5 pt-8 sm:px-10 sm:pt-10 lg:px-16">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:gap-y-8 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
            <div className="col-span-2 max-w-sm lg:col-span-1">
              <a
                href="#services"
                aria-label={siteContent.brand.name}
                className="inline-flex items-center gap-3 rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl border border-accent/60 font-editorial text-xl italic text-accent"
                >
                  M
                </span>
                {siteContent.brand.name}
              </a>
              <p className="mt-4 max-w-xs font-editorial text-lg leading-relaxed text-white/65">
                {siteContent.brand.tagline}
              </p>
            </div>

            <div>
              <h2 className="font-technical text-[0.65rem] font-semibold tracking-[0.18em] text-accent">
                {siteContent.footer.columns[0]}
              </h2>
              <nav aria-label={siteContent.footer.columns[0]} className="mt-3 flex flex-col items-start gap-1">
                {sectionLinks.map((link) => (
                  <RollLink key={link.href} href={link.href}>
                    {link.label}
                  </RollLink>
                ))}
              </nav>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h2 className="font-technical text-[0.65rem] font-semibold tracking-[0.18em] text-accent">
                {siteContent.footer.columns[1]}
              </h2>
              <address className="mt-3 flex flex-col items-start gap-2 not-italic">
                <RollLink href={`mailto:${siteContent.contact.email}`}>
                  {siteContent.contact.email}
                </RollLink>
                <RollLink href={`tel:${siteContent.contact.phone.replaceAll(" ", "")}`}>
                  {siteContent.contact.phone}
                </RollLink>
                <span className="max-w-56 text-sm leading-relaxed text-white/55">
                  {siteContent.contact.address}
                </span>
              </address>
            </div>

            <div>
              <h2 className="font-technical text-[0.65rem] font-semibold tracking-[0.18em] text-accent">
                {siteContent.footer.columns[2]}
              </h2>
              <div className="mt-3 flex flex-col items-start gap-1">
                {instagramIsConfigured ? (
                  <RollLink href={siteContent.contact.instagramUrl} external>
                    {siteContent.footer.instagram}
                  </RollLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex min-h-7 items-center text-sm text-white/45"
                  >
                    {siteContent.footer.instagram}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {siteContent.footer.legal.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <span>{siteContent.footer.copyright}</span>
              <button
                type="button"
                onClick={backToTop}
                className="group inline-flex min-h-9 items-center gap-2 self-start text-white/75 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:self-auto"
              >
                {siteContent.footer.backToTop}
                <ArrowUp
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-y-1"
                />
              </button>
            </div>
          </div>

          <div className="footer-wordmark-wrap relative mt-5 overflow-hidden" aria-hidden="true">
            <span className="footer-wordmark footer-wordmark-outline">
              {siteContent.footer.wordmark}
            </span>
            <motion.span
              className="footer-wordmark footer-wordmark-fill absolute inset-0"
              style={{
                scaleX: reducedMotion ? 1 : wordmarkScale,
                transformOrigin: "left center",
              }}
            >
              {siteContent.footer.wordmark}
            </motion.span>
          </div>
        </div>
      </footer>
      <div
        ref={revealTrackRef}
        aria-hidden="true"
        className="footer-reveal-track relative z-10"
      />
    </>
  );
}
