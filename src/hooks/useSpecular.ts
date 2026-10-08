import { useCallback, type PointerEvent } from "react";

/**
 * Feeds the pointer position into --mx / --my so `.specular` surfaces
 * catch a soft highlight that follows the cursor, like light on glass.
 */
export function useSpecular<T extends HTMLElement>() {
  return useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}
