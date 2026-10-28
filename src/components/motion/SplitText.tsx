"use client";

import { motion } from "motion/react";
import { createElement, type ElementType } from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "./useReducedMotion";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  mode?: "words" | "lines";
  emphasisWord?: string;
  delay?: number;
  stagger?: number;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const itemVariants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: EASE },
  },
};

function normalizeWord(word: string) {
  return word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
}

export function SplitText({
  text,
  as = "p",
  className,
  mode = "words",
  emphasisWord,
  delay = 0,
  stagger = 0.06,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const emphasis = emphasisWord ? normalizeWord(emphasisWord) : "";

  const renderHighlightedWords = (line: string, keyPrefix: string) =>
    line.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;
      const emphasized = emphasis !== "" && normalizeWord(part) === emphasis;
      return (
        <span
          key={`${keyPrefix}-${index}`}
          className={emphasized ? "font-editorial text-accent" : ""}
        >
          {part}
        </span>
      );
    });

  let contents;
  if (reducedMotion) {
    contents =
      mode === "lines"
        ? text.split("\n").map((line, index) => (
            <span className="block" key={`line-${index}`}>
              {renderHighlightedWords(line, `plain-${index}`)}
            </span>
          ))
        : renderHighlightedWords(text, "plain");
  } else if (mode === "lines") {
    contents = text.split("\n").map((line, index) => (
      <span className="block overflow-hidden" key={`line-${index}`}>
        <motion.span className="inline-block" variants={itemVariants}>
          {renderHighlightedWords(line, `line-${index}`)}
        </motion.span>
      </span>
    ));
  } else {
    contents = text.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;
      const emphasized = emphasis !== "" && normalizeWord(part) === emphasis;
      return (
        <span
          className="inline-block overflow-hidden align-bottom"
          key={`word-${index}`}
        >
          <motion.span
            className={`inline-block ${emphasized ? "font-editorial text-accent" : ""}`}
            variants={itemVariants}
          >
            {part}
          </motion.span>
        </span>
      );
    });
  }

  return createElement(
    as,
    { className, "aria-label": text },
    reducedMotion ? (
      <span aria-hidden="true" className={mode === "words" ? "inline" : "block"}>
        {contents}
      </span>
    ) : (
      <motion.span
        aria-hidden="true"
        className={mode === "words" ? "inline" : "block"}
        initial="hidden"
        whileInView={preloaderComplete ? "visible" : undefined}
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: stagger,
            },
          },
        }}
      >
        {contents}
      </motion.span>
    ),
  );
}
