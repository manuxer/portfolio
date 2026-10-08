import { useEffect, useState } from "react";
import { useNavigation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

/**
 * A hairline of brand light along the top edge while a route is loading.
 * It only appears if loading takes longer than a blink.
 */
export function NavProgress() {
  const loading = useNavigation().state === "loading";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      const t = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setVisible(true), 140);
    return () => window.clearTimeout(t);
  }, [loading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
          style={{
            background: "linear-gradient(90deg, var(--brand-yellow), var(--brand-red), var(--brand-green), var(--brand-blue))",
          }}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85, transition: { duration: 2.4, ease: [0.1, 0.8, 0.2, 1] } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.35 } }}
        />
      )}
    </AnimatePresence>
  );
}
