import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotionConfig, useScroll, useSpring } from "motion/react";
import { focusTarget } from "@/lib/focus";
import { spring } from "@/lib/motion";
import { prefersLessMotion } from "@/lib/motionPref";

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
  // Keyboard users can always reach the dock: focusing it reveals it.
  const [focusWithin, setFocusWithin] = useState(false);
  const shown = visible || focusWithin;
  const listRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionConfig();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  // Show between the first section and the footer, and track the current
  // section from geometry (so instant jumps, e.g. Back to top, never leave it stale).
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
        const mid = window.innerHeight * 0.5;
        const passed = items
          .map((item) => document.getElementById(item.id))
          .filter((s): s is HTMLElement => s !== null && s.getBoundingClientRect().top <= mid);
        setActive(passed.at(-1)?.id ?? items[0]?.id);
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

  // Keep the active chip centred when the dock scrolls horizontally (mobile),
  // except while a chip has focus: then the focused chip must stay in view.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !chip || list.contains(document.activeElement)) return;
    list.scrollTo({
      left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, shown, reduced]);

  // Scroll to the section and take keyboard/screen-reader focus with it.
  const jump = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const reduced = prefersLessMotion();
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    focusTarget(section.querySelector<HTMLElement>("h2") ?? section);
  };

  return (
    // Always mounted and in the tab order; it fades in on scroll or on focus.
    <motion.nav
      ref={navRef}
      aria-label="On this page"
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
      className="fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 flex justify-center px-3"
      initial={false}
      animate={
        shown
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
          : { opacity: 0, y: 24, scale: 0.95, filter: "blur(6px)" }
      }
      style={{ pointerEvents: shown ? "auto" : "none" }}
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
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
              aria-current={active === item.id ? "true" : undefined}
              // The ring draws inside the pill so the scroller can't clip it.
              className="relative min-h-9 shrink-0 rounded-full px-4 text-[0.875rem] font-medium text-fg-2 transition-colors hover:text-fg focus-visible:outline-offset-[-3px] aria-[current=true]:text-fg"
            >
              {active === item.id && (
                // -z-10 keeps the lens under the chip's inset focus ring (inside the glass pill's stacking context).
                <motion.span layoutId="dock-active" className="nav-indicator nav-indicator-active -z-10" transition={spring.snappy} />
              )}
              <span className="relative whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-5 bottom-[3px] h-[2px] origin-left rounded-full"
          style={{
            scaleX: reduced ? scrollYProgress : progress,
            background: "linear-gradient(90deg, var(--brand-yellow), var(--brand-red), var(--brand-green), var(--brand-blue))",
          }}
        />
      </div>
    </motion.nav>
  );
}
