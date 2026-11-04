import { motion, stagger as staggerFrom, type Variants } from "motion/react";
import { ease } from "@/lib/motion";
import { enterOpacity, useIntroHold } from "@/lib/intro";

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
  /** How far each word rises (default 0.35em). */
  rise?: number | string;
}

const word: Variants = {
  hidden: (rise: number | string = "0.35em") => ({ opacity: enterOpacity, y: rise, filter: "blur(12px)" }),
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
export function WordsReveal({ text, as = "h1", className, delay = 0, stagger = 0.075, rise }: WordsRevealProps) {
  const held = useIntroHold();
  const parts: Part[] = typeof text === "string" ? [{ text }] : text;
  const label = parts.map((p) => p.text).join(" ");
  const Comp = motion[as];

  const total = label.split(" ").length;
  let index = 0;
  return (
    <Comp
      className={className}
      aria-label={label}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: staggerFrom(stagger, { startDelay: delay }) } },
      }}
      initial="hidden"
      whileInView={held ? undefined : "show"}
      viewport={{ once: true }}
    >
      {parts.map((part, p) =>
        part.text.split(" ").map((w, i) => {
          index += 1;
          return (
            <span key={`${p}-${i}`} aria-hidden="true">
              <motion.span variants={word} custom={rise} className={`inline-block ${part.className ?? ""}`}>
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
