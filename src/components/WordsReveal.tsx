import { motion, stagger as staggerFrom, type Variants } from "motion/react";
import { ease } from "@/lib/motion";

interface Part {
  text: string;
  className?: string;
}

interface WordsRevealProps {
  /** Plain text, or styled runs such as a gradient name. */
  text: string | Part[];
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
}

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: ease.out },
    transitionEnd: { filter: "none" },
  },
};

/**
 * Headline that resolves word by word out of a soft blur — the same
 * cadence Apple uses on its keynote title cards.
 */
export function WordsReveal({ text, as = "h1", className, delay = 0, stagger = 0.075 }: WordsRevealProps) {
  const parts: Part[] = typeof text === "string" ? [{ text }] : text;
  const label = parts.map((p) => p.text).join(" ");
  const Comp = motion[as];

  const total = label.split(" ").length;
  let index = 0;
  return (
    <Comp
      className={className}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: staggerFrom(stagger, { startDelay: delay }) } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {/* Real text for assistive tech; the animated words below are visual only. */}
      <span className="sr-only">{label}</span>
      {parts.map((part, p) =>
        part.text.split(" ").map((w, i) => {
          index += 1;
          return (
            <span key={`${p}-${i}`} aria-hidden="true">
              <motion.span variants={word} className={`inline-block ${part.className ?? ""}`}>
                {w}
              </motion.span>
              {index < total ? " " : null}
            </span>
          );
        }),
      )}
    </Comp>
  );
}
