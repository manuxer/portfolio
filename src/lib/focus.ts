/**
 * Moves keyboard and screen-reader focus to a non-interactive landmark or
 * heading (making it programmatically focusable first) without scrolling.
 */
export function focusTarget(el?: HTMLElement | null) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
