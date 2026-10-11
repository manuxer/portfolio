import type { PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import character from "@/assets/hero-character.webp?w=1100&format=webp&quality=86&imagetools";

const tiltSpring = { stiffness: 150, damping: 20, mass: 0.7 };

/**
 * TEMPORARY (trial build): the 3D character beside the hero text, standing in
 * front of a frosted-glass slab. Pointer movement tilts the scene in depth and
 * slides a gloss highlight across the character (masked to its silhouette).
 * To remove: delete <HeroCharacter /> in pages/Home.tsx, this file and
 * assets/hero-character.webp.
 */
export function HeroCharacter({ opacity }: { opacity: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const gx = useMotionValue(28);
  const gy = useMotionValue(22);
  const gloss = useMotionTemplate`radial-gradient(60% 45% at ${gx}% ${gy}%, rgb(255 255 255 / 0.5), transparent 70%), linear-gradient(118deg, transparent 38%, rgb(255 255 255 / 0.22) 48%, transparent 58%)`;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 6);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const mask = {
    WebkitMaskImage: `url(${character})`,
    maskImage: `url(${character})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "right bottom",
    maskPosition: "right bottom",
  } as const;

  return (
    // Fills the hero from below the nav down to the fold, on the right of the text.
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="container-x relative h-full">
        <div
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="pointer-events-auto absolute bottom-0 right-0 top-[88px] w-[50%] [perspective:1400px]"
        >
          <motion.div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.35 }}
          >
            {/* Frosted-glass slab behind the character; its base runs past the fold. */}
            <div
              className="glass glass-rim absolute -bottom-12 left-[10%] right-0 top-[30%] rounded-[44px] [transform:translateZ(-60px)]"
              style={{ ["--glass-blur" as string]: "28px" }}
            />
            {/* The character, in front of the glass. */}
            <div className="absolute inset-0 [transform:translateZ(50px)]">
              <img
                src={character}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-contain object-right-bottom [filter:drop-shadow(0_0_1px_rgb(255_255_255/0.55))_drop-shadow(0_40px_50px_rgb(0_0_0/0.35))]"
              />
              {/* Glassy gloss, clipped to the character's silhouette. */}
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                style={{ ...mask, background: gloss, opacity: 0.55 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
