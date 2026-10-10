import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { setMotionPaused, useMotionPaused } from "@/lib/motionPref";
import { useSpecular } from "@/hooks/useSpecular";

/** Pauses the ambient light, halo and gradient loops site-wide (WCAG 2.2.2). */
export function MotionToggle({ className }: { className?: string }) {
  const paused = useMotionPaused();
  const onPointerMove = useSpecular<HTMLButtonElement>();

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      onPointerMove={onPointerMove}
      aria-label="Pause animations"
      aria-pressed={paused}
      className={cn("btn btn-icon specular overflow-hidden text-fg-2 hover:text-fg", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={paused ? "paused" : "playing"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="grid place-items-center"
        >
          {/* The icon shows what a press will do: resume when paused, pause when playing. */}
          {paused ? <Play size={16} strokeWidth={2} /> : <Pause size={16} strokeWidth={2} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
