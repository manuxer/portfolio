/** For imperative code (scrolling, view transitions): the OS reduced-motion setting. */
export function prefersLessMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
