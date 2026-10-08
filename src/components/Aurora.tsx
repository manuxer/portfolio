import { useEffect, type CSSProperties } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

interface Blob {
  color: string;
  left: string;
  top: string;
  size?: string;
  dx?: string;
  dy?: string;
  dur?: string;
  delay?: string;
}

const heroBlobs: Blob[] = [
  { color: "var(--brand-yellow)", left: "-12%", top: "-28%", dx: "10vw", dy: "8vh", dur: "28s" },
  { color: "var(--brand-red)", left: "52%", top: "-34%", dx: "-8vw", dy: "10vh", dur: "24s", delay: "-6s" },
  { color: "var(--brand-green)", left: "-6%", top: "38%", dx: "12vw", dy: "-6vh", dur: "30s", delay: "-12s" },
  { color: "var(--brand-blue)", left: "48%", top: "30%", dx: "-10vw", dy: "-8vh", dur: "26s", delay: "-3s" },
];

/**
 * Brand-coloured light drifting behind the hero. Blobs are radial gradients
 * moved with transforms only, and the whole field leans gently toward the
 * pointer so the glass in front of it feels physical.
 */
export function Aurora({
  blobs = heroBlobs,
  className,
  interactive = true,
  grain = true,
}: {
  blobs?: Blob[];
  className?: string;
  interactive?: boolean;
  /** Film grain to break up gradient banding — full-bleed heroes only. */
  grain?: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 40, damping: 20 });
  const y = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!interactive || reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set((e.clientX / innerWidth - 0.5) * 60);
      y.set((e.clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, reduced, x, y]);

  return (
    <div className={cn("aurora", className)} aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ x, y }}>
        {blobs.map((b) => (
          <span
            key={b.color + b.left}
            className="aurora-blob"
            style={
              {
                "--c": b.color,
                "--size": b.size,
                "--dx": b.dx,
                "--dy": b.dy,
                "--dur": b.dur,
                "--delay": b.delay,
                left: b.left,
                top: b.top,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>
      {grain && <div className="aurora-grain" />}
    </div>
  );
}

/** Low-key ambient light for content sections that host glass cards. */
export function Ambient({ variant = "a" }: { variant?: "a" | "b" | "c" }) {
  const sets: Record<string, Blob[]> = {
    a: [
      { color: "var(--brand-blue)", left: "-18%", top: "-10%", size: "46vmax", dur: "34s" },
      { color: "var(--brand-yellow)", left: "64%", top: "40%", size: "40vmax", dur: "30s", delay: "-8s" },
    ],
    b: [
      { color: "var(--brand-green)", left: "60%", top: "-14%", size: "44vmax", dur: "32s" },
      { color: "var(--brand-red)", left: "-14%", top: "46%", size: "38vmax", dur: "28s", delay: "-10s" },
    ],
    c: [
      { color: "var(--brand-red)", left: "-10%", top: "-20%", size: "42vmax", dur: "30s" },
      { color: "var(--brand-blue)", left: "58%", top: "30%", size: "46vmax", dur: "34s", delay: "-6s" },
    ],
  };
  return <Aurora blobs={sets[variant]} interactive={false} grain={false} className="opacity-40" />;
}
