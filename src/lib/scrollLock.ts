let locks = 0;

/**
 * Freezes page scroll while an overlay is open. Padding stands in for the
 * scrollbar so the layout doesn't shift, and nested locks are counted.
 */
export function lockScroll() {
  const root = document.documentElement;
  if (locks++ === 0) {
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) {
      root.style.overflow = "";
      root.style.paddingRight = "";
    }
  };
}
