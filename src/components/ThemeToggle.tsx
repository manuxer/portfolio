import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/cn";
import { useSpecular } from "@/hooks/useSpecular";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", theme === "dark" ? "#000000" : "#fbfbfd");
  });
  listeners.forEach((l) => l());
}

let observer: MutationObserver | null = null;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // Also follow theme changes made outside the toggle (e.g. by a host page).
  observer ??= new MutationObserver(() => listeners.forEach((l) => l()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
};

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

/** Follows the OS setting until the visitor makes an explicit choice. */
function useSystemSync() {
  useEffect(() => {
    const mq = media();
    const onChange = () => {
      if (!storedTheme()) apply(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const onPointerMove = useSpecular<HTMLButtonElement>();
  useSystemSync();

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the choice simply won't persist */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply(next);
      return;
    }

    // Grow the new theme out of the button as a circle.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${r}px`);
    root.classList.add("theme-vt");

    const transition = document.startViewTransition(() => flushSync(() => apply(next)));
    transition.finished.finally(() => root.classList.remove("theme-vt"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      onPointerMove={onPointerMove}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("btn btn-icon specular overflow-hidden text-fg-2 hover:text-fg", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5, filter: "blur(4px)" }}
          animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="grid place-items-center"
        >
          {isDark ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
