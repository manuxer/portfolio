import type { Transition } from "motion/react";

/** Cubic-bezier curves shared with the CSS custom properties in index.css. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  spring: [0.32, 0.72, 0, 1],
} as const;

/** Springs tuned to feel like UIKit: quick to respond, no wobble. */
export const spring = {
  snappy: { type: "spring", stiffness: 520, damping: 40, mass: 0.7 },
  smooth: { type: "spring", stiffness: 260, damping: 30 },
  soft: { type: "spring", stiffness: 140, damping: 22 },
} as const satisfies Record<string, Transition>;
