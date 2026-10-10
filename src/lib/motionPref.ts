import { useSyncExternalStore } from "react";

/**
 * Site-level "Pause animations" switch (WCAG 2.2.2). Stored on <html> as
 * data-motion="paused" (restored pre-paint by index.html) and in localStorage.
 * Paused also means "reduce motion" for everything Motion drives.
 */
const listeners = new Set<() => void>();

const read = () => document.documentElement.dataset.motion === "paused";

export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  try {
    if (paused) localStorage.setItem("motion", "paused");
    else localStorage.removeItem("motion");
  } catch {
    /* private mode — the choice simply won't persist */
  }
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useMotionPaused() {
  return useSyncExternalStore(subscribe, read, () => false);
}

/** For imperative code (scrolling, view transitions): the OS setting or the site switch. */
export function prefersLessMotion() {
  return read() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
