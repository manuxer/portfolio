import type { PointerEvent } from "react";
import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const tiltSpring = { stiffness: 180, damping: 18, mass: 0.6 };

/**
 * tvOS-style parallax: the surface leans toward the pointer and a glare
 * tracks it. Mouse only — touch and reduced-motion users get a flat card.
 */
export function useTilt(max = 4) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const gx = useMotionValue(50);
  const gy = useMotionValue(0);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.55), transparent 55%)`;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: { rotateX, rotateY, transformPerspective: 1100 },
    glare,
    handlers: { onPointerMove, onPointerLeave },
  };
}
