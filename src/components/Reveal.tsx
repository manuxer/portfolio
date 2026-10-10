import type { ReactNode } from "react";
import { motion, stagger as staggerFrom, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled upward while fading in. */
  y?: number;
  /** Soft-focus pull: great on type, skip it on large images. */
  blur?: boolean;
}

/** Fades content up into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28, blur = true }: RevealProps) {
  return (
    <motion.div
      className={cn("reveal", className)}
      initial={{ opacity: 0, y, ...(blur && { filter: "blur(8px)" }) }}
      // A leftover `filter` would make this wrapper a backdrop root and stop
      // nested glass from seeing what is behind it, so clear it when done.
      whileInView={{ opacity: 1, y: 0, ...(blur && { filter: "blur(0px)", transitionEnd: { filter: "none" } }) }}
      viewport={viewport}
      transition={{ duration: 1, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

const group: Variants = {
  hidden: {},
  show: (interval: number = 0.07) => ({ transition: { delayChildren: staggerFrom(interval) } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: ease.out },
    transitionEnd: { filter: "none" },
  },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}

/** Reveals each <StaggerItem> child in sequence. */
export function Stagger({ children, className, stagger = 0.07, as = "div" }: StaggerProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={group}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = motion[as];
  return (
    <Comp className={cn("reveal", className)} variants={item}>
      {children}
    </Comp>
  );
}
