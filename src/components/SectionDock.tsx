import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { spring } from "@/lib/motion";

export interface DockItem {
  id: string;
  label: string;
}

/**
 * Floating glass table of contents for long case studies. It rises in once
 * the reader is past the header, tracks the section in view with a sliding
 * lens, and shows reading progress along its lower edge.
 */
export function SectionDock({ items }: { items: DockItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [visible, setVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  // Active section: whichever crosses the middle band of the viewport.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Show between the first section and the footer.
  useEffect(() => {
    const first = document.getElementById(items[0]?.id ?? "");
    const footer = document.querySelector("footer");
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const startY = first ? first.getBoundingClientRect().top : 0;
        const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
        setVisible(startY < window.innerHeight * 0.6 && footerTop > window.innerHeight - 40);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  // Keep the active chip centred when the dock scrolls horizontally (mobile).
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !chip) return;
    list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active, visible]);

  const jump = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Sections"
          className="fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 flex justify-center px-3"
          initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          exit={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
          transition={spring.smooth}
        >
          <div className="glass glass-strong glass-rim relative max-w-full overflow-hidden rounded-full p-1.5">
            <div ref={listRef} className="no-scrollbar relative flex overflow-x-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  data-id={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  aria-current={active === item.id ? "true" : undefined}
                  className="relative h-9 shrink-0 rounded-full px-4 text-[0.875rem] font-medium text-fg-2 transition-colors hover:text-fg aria-[current=true]:text-fg"
                >
                  {active === item.id && (
                    <motion.span layoutId="dock-active" className="nav-indicator nav-indicator-active" transition={spring.snappy} />
                  )}
                  <span className="relative whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-5 bottom-[3px] h-[2px] origin-left rounded-full"
              style={{
                scaleX: progress,
                background: "linear-gradient(90deg, var(--brand-yellow), var(--brand-red), var(--brand-green), var(--brand-blue))",
              }}
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
