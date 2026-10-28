"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";

export function FloatingWidgets() {
  const reducedMotion = useReducedMotion();
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowTeaser(true), 4000);
    return () => window.clearTimeout(timeout);
  }, []);

  const whatsappNumber = siteContent.contact.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat on WhatsApp at ${siteContent.contact.phone}`}
        data-cursor="Open"
        className="fixed bottom-5 left-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <MessageCircle aria-hidden="true" className="size-6" />
        <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-[#9cff72]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#9cff72] opacity-70 motion-reduce:animate-none" />
        </span>
      </a>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showTeaser && (
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-w-[min(18rem,calc(100vw-2.5rem))] items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink shadow-xl"
              role="status"
            >
              <p className="flex-1">{siteContent.widgets.chatbotTeaser}</p>
              <button
                type="button"
                aria-label="Dismiss chatbot message"
                onClick={() => setShowTeaser(false)}
                className="rounded-full p-1 text-ink/60 hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-label="Open engineering chatbot"
          data-cursor="Open"
          className="flex size-14 items-center justify-center rounded-full bg-navy text-white shadow-xl shadow-navy/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
        </button>
      </div>
    </>
  );
}
