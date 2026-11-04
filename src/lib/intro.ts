import { useSyncExternalStore } from "react";

/*
 * Coordination between the first-load logo intro (src/intro) and the page.
 *
 * A pre-paint script in index.html adds `intro-pending` to <html> when the intro
 * should play (landing page, first visit this session). While it's set, page
 * entrance animations hold their start state behind the intro, then play when
 * the intro hands the page over in its last act.
 */

export const INTRO_PENDING = "intro-pending";
export const INTRO_ACTIVE = "intro-active";
export const INTRO_SESSION_KEY = "manuxer:intro";

const root = typeof document === "undefined" ? null : document.documentElement;

/** Decided once, before the app renders. */
export const introWillPlay = !!root?.classList.contains(INTRO_PENDING);

/**
 * How page content rises in when the intro hands it over: hero headline → subtext → CTA →
 * rest, ~60 ms apart, a short rise. Held content sits at a near-zero opacity rather than 0
 * so it still paints (and counts for LCP) under the opaque stage.
 */
export const INTRO_PAGE = {
  rise: 14,
  stagger: 0.06,
  heldOpacity: 0.01,
} as const;

/** Start opacity for entrance animations: near-zero (not 0) while the intro covers the page. */
export const enterOpacity = introWillPlay ? INTRO_PAGE.heldOpacity : 0;

let held = introWillPlay;
let claimed = false;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

/** Lets held page content animate in. */
export function releaseIntroHold() {
  if (!held) return;
  held = false;
  listeners.forEach((fn) => fn());
}

/** Removes the intro's page states and releases the content (also the failsafe). */
export function endIntro() {
  root?.classList.remove(INTRO_PENDING, INTRO_ACTIVE);
  releaseIntroHold();
}

/**
 * Called by the intro when it mounts. False if the pre-paint cover already gave
 * up (slow network), in which case the page is showing and the intro must not play.
 */
export function claimIntro() {
  if (claimed) return true; // React's dev double-mount re-runs the intro's effect
  if (!root?.classList.contains(INTRO_PENDING)) return false;
  claimed = true;
  root.classList.replace(INTRO_PENDING, INTRO_ACTIVE);
  return true;
}

// Failsafes: if the pre-paint cover gives up (index.html's timeout) before the intro claims
// the page, release the content at that moment; and if the intro never loads at all, show it.
if (introWillPlay && root) {
  const cover = new MutationObserver(() => {
    if (claimed || root.classList.contains(INTRO_PENDING)) return;
    cover.disconnect();
    endIntro();
  });
  cover.observe(root, { attributes: true, attributeFilter: ["class"] });
  setTimeout(() => !claimed && endIntro(), 4500);
}

/** True for the first landing-page render after the intro (later visits to Home this load use the normal cadence). */
let introCadenceUsed = false;
export function takeIntroCadence() {
  return introWillPlay && !introCadenceUsed;
}
export function markIntroCadenceUsed() {
  introCadenceUsed = true;
}

/** True while the intro covers the page: entrance animations should wait. */
export function useIntroHold() {
  return useSyncExternalStore(subscribe, () => held, () => false);
}
