import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotionConfig } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * A number that counts up from zero the first time it is seen. Assistive tech
 * reads the final value from hidden text; the animated digits are visual only.
 */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotionConfig();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: ease.out,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduced]);

  return (
    <span className={className}>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span ref={ref} aria-hidden="true">
        {`${reduced ? value : 0}${suffix}`}
      </span>
    </span>
  );
}
