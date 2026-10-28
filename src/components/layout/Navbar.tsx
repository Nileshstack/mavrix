"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Magnetic } from "@/src/components/motion/Magnetic";
import { useLenis } from "@/src/components/motion/SmoothScroll";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

const links = [
  { id: "services", labelIndex: 0 },
  { id: "how-we-work", labelIndex: 1 },
  { id: "stack", labelIndex: 2 },
  { id: "faq", labelIndex: 3 },
  { id: "contact", labelIndex: 4 },
] as const;

export function Navbar() {
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string>("services");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const scrollTo = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      const performScroll = () => {
        if (lenis && !reducedMotion) {
          lenis.start();
          lenis.scrollTo(target, { offset: -90 });
        } else {
          target.scrollIntoView({
            behavior: reducedMotion ? "instant" : "smooth",
            block: "start",
          });
        }
      };

      if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        window.requestAnimationFrame(performScroll);
        return;
      }

      performScroll();
    },
    [lenis, menuOpen, reducedMotion],
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const link of links) {
      const section = document.getElementById(link.id);
      if (!section) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(link.id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(section);
      observers.push(observer);
    }

    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const heroBottom = document.getElementById("hero")?.getBoundingClientRect().bottom;
      setScrolled(heroBottom !== undefined && heroBottom <= 100);
      if (!reducedMotion && !menuOpen && currentY > 120) {
        setHidden(currentY > previousY + 2);
      } else {
        setHidden(false);
      }
      previousY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuOpen, reducedMotion]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [lenis, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const dialog = document.getElementById("mobile-menu");
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    document
      .querySelector<HTMLElement>("#mobile-menu a[href]")
      ?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navigate = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollTo(id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-6xl"
        animate={{ y: hidden && !menuOpen ? -120 : 0, opacity: hidden && !menuOpen ? 0 : 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Main navigation"
          className={`relative z-50 flex items-center justify-between rounded-full border px-4 py-3 shadow-lg shadow-navy/5 backdrop-blur-xl sm:px-6 ${
            scrolled || menuOpen
              ? "border-line/80 bg-white/90"
              : "border-white/30 bg-white/70"
          }`}
        >
          <a
            href="#services"
            onClick={navigate("services")}
            className="flex items-center gap-2 font-semibold tracking-tight text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label={siteContent.brand.name}
          >
            <BrandMark />
            <span>{siteContent.brand.name}</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const label = siteContent.nav.items[link.labelIndex];
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={navigate(link.id)}
                    className="relative block overflow-hidden rounded-full px-3 py-2 text-sm text-ink/75 hover:text-navy focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {active === link.id && (
                      <motion.span
                        layoutId="navbar-active-link"
                        className="absolute inset-0 rounded-full bg-surface"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                    <span className="relative block h-5 overflow-hidden">
                      <span className="flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1/2">
                        <span className="h-5">{label}</span>
                        <span aria-hidden="true" className="h-5 text-navy">
                          {label}
                        </span>
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Magnetic radius={100} strength={0.14}>
              <a
                href="#contact"
                onClick={navigate("contact")}
                data-cursor="Open"
                className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-navy px-5 text-sm font-medium text-white hover:bg-accent hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {siteContent.nav.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            className="flex size-10 items-center justify-center rounded-full bg-navy text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-menu" : undefined}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={reducedMotion ? { opacity: 1 } : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-30 flex flex-col justify-between bg-navy px-6 pb-10 pt-28 text-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          >
            <nav aria-label="Mobile navigation">
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={link.id} className="overflow-hidden">
                    <motion.a
                      href={`#${link.id}`}
                      onClick={navigate(link.id)}
                      initial={reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: reducedMotion ? 0.2 : 0.6,
                        delay: reducedMotion ? 0 : index * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`block text-5xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-accent ${
                        active === link.id ? "text-accent" : ""
                      }`}
                    >
                      {siteContent.nav.items[link.labelIndex]}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-2 border-t border-white/15 pt-6 font-technical text-sm text-white/65">
              <a
                href="#contact"
                onClick={navigate("contact")}
                data-cursor="Open"
                className="mb-4 inline-flex min-h-11 items-center gap-3 rounded-full bg-accent px-5 font-sans text-sm font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {siteContent.nav.cta}
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              <a
                className="block focus-visible:outline-2 focus-visible:outline-accent"
                href={`mailto:${siteContent.contact.email}`}
              >
                {siteContent.contact.email}
              </a>
              <a
                className="block focus-visible:outline-2 focus-visible:outline-accent"
                href={`tel:${siteContent.contact.phone.replace(/\s/g, "")}`}
              >
                {siteContent.contact.phone}
              </a>
              <p>{siteContent.contact.address}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BrandMark() {
  return (
    <svg aria-hidden="true" className="size-8" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#0A0F1F" />
      <path d="M9 29V11h4.5L20 21l6.5-10H31v18h-4.5V19l-6.5 9-6.5-9v10H9Z" fill="#3DB5FF" />
    </svg>
  );
}
