/**
 * Shapes for the first-load intro, all in one coordinate system ("logo units", the
 * compact mark's own: x right, y down, 464 × 417 for the mark).
 *
 * The compact mark is the header logo (src/lib/logo.ts, drawn by Logo.tsx). The full
 * "MANU" logo is built around it: its M *is* the compact mark's body with a plain
 * yellow notch, and the A, N and U each carry one of the other stripe colours. So the
 * full logo can unfold out of the mark and fold back into it as one object: the M
 * grows/shrinks into the mark while the red, green and blue accents travel between
 * the letters and the notch, changing shape between accent and stripe.
 *
 * To swap in different artwork, replace FULL_LETTERS (polygons in the same units) and
 * the constants in src/lib/logo.ts; everything else is derived.
 */
import { LOGO_BODY_POINTS, LOGO_STRIPES, LOGO_TRIANGLE, LOGO_VIEWBOX } from "@/lib/logo";

export type Pt = readonly [number, number];

/* ── Full logo ───────────────────────────────────────────────────────────────
   A, N and U come from the traced "MANU" artwork (ManuWordmark.tsx, 1090×259),
   cleaned up into straight edges and scaled so its M matches the compact mark. */
const K = 413 / 255; // wordmark M height → compact body height
const w = ([x, y]: Pt): Pt => [1 + (x - 1) * K, 4 + (y - 3) * K];

const [ux0, ux1, ux2, ux3] = [878, 949, 1018, 1090].map((x) => w([x, 0])[0]);
const [, uTop] = w([0, 162]);
const [, uInner] = w([0, 186]);
const [, uBase] = w([0, 258]);
const [, uArm0] = w([0, 1]);
const [, uArm1] = w([0, 137]);

/** Half-ellipse from (x0, top) round the bottom to (x1, top), as points. */
function halfEllipse(x0: number, x1: number, top: number, depth: number, steps: number): Pt[] {
  const cx = (x0 + x1) / 2;
  const rx = Math.abs(x1 - x0) / 2;
  const leftToRight = x1 > x0; // sweeps π→0; right→left sweeps 0→π
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = leftToRight ? Math.PI * (1 - i / steps) : (Math.PI * i) / steps;
    return [cx + rx * Math.cos(a), top + depth * Math.sin(a)] as Pt;
  });
}

export interface Letter {
  id: "a" | "n" | "u";
  /** The letter's light shape, which emerges from / folds back into the mark. */
  body: Pt[];
  /** Coloured accent(s): each travels to and from a stripe of the compact mark. */
  accents: Pt[][];
  /** Which compact stripe (index into LOGO_STRIPES) the accents correspond to. */
  stripe: number;
}

export const FULL_M = {
  body: LOGO_BODY_POINTS as readonly Pt[],
  /** The M's yellow notch: the compact mark's stripe triangle, all yellow. */
  notch: LOGO_TRIANGLE as readonly Pt[],
};

export const FULL_LETTERS: Letter[] = [
  {
    id: "a",
    body: [w([397, 101]), w([480, 258]), w([313, 258])],
    accents: [[w([450, 1.5]), w([587, 258]), w([520, 258]), w([417, 64])]],
    stripe: 1,
  },
  {
    id: "n",
    body: [w([614, 20]), w([840, 245]), w([840, 258]), w([614, 258])],
    accents: [[w([644, 1]), w([840, 1]), w([840, 197.5])]],
    stripe: 2,
  },
  {
    id: "u",
    body: [
      ...halfEllipse(ux0, ux3, uTop, uBase - uTop, 40),
      ...halfEllipse(ux2, ux1, uTop, uInner - uTop, 24),
    ],
    accents: [
      [[ux0, uArm0], [ux1, uArm0], [ux1, uArm1], [ux0, uArm1]],
      [[ux2, uArm0], [ux3, uArm0], [ux3, uArm1], [ux2, uArm1]],
    ],
    stripe: 3,
  },
];

/** Bounds of the full logo, and the stage around it (room for the compact mark and depth). */
export const FULL_BOUNDS = { x: 1, y: 0, w: ux3 - 1, h: LOGO_VIEWBOX.h };
export const FULL_CENTER: Pt = [FULL_BOUNDS.x + FULL_BOUNDS.w / 2, FULL_BOUNDS.y + FULL_BOUNDS.h / 2];
export const STAGE = { x: FULL_BOUNDS.x - 40, y: FULL_BOUNDS.y - 120, w: FULL_BOUNDS.w + 80, h: FULL_BOUNDS.h + 240 };

/* ── Compact mark ────────────────────────────────────────────────────────── */

/** Stripe i of the compact mark as a polygon: its rect clipped to the notch triangle. */
export function stripeShape(i: number): Pt[] {
  const [[lx, top], [rx], [ax, ay]] = LOGO_TRIANGLE;
  const s = LOGO_STRIPES[i];
  const y0 = Math.max(s.y, top);
  const y1 = Math.min(s.y + s.h, ay);
  const left = (y: number) => lx + ((y - top) * (ax - lx)) / (ay - top);
  const right = (y: number) => rx + ((y - top) * (ax - rx)) / (ay - top);
  return y1 >= ay
    ? [[left(y0), y0], [right(y0), y0], [ax, ay]]
    : [[left(y0), y0], [right(y0), y0], [right(y1), y1], [left(y1), y1]];
}

/**
 * The M body as two convex halves meeting at the V's tip. The tip sits only 7 units above
 * the base, so a bevelled solid is built per half (each grown back to its outline) and
 * their union is the body.
 */
export function bodyHalves(): Pt[][] {
  const [tl, tip, tr, br, bl] = FULL_M.body;
  return [
    [tl, tip, [tip[0], br[1]], bl],
    [tip, tr, br, [tip[0], br[1]]],
  ];
}

/** Where the compact mark sits on the stage: centred on the full logo, scaled by `scale`. */
export function compactPlacement(scale: number) {
  const [cx, cy] = FULL_CENTER;
  const ox = LOGO_VIEWBOX.w / 2;
  const oy = LOGO_VIEWBOX.h / 2;
  const toStage = ([x, y]: Pt): Pt => [cx + (x - ox) * scale, cy + (y - oy) * scale];
  return {
    toStage,
    /** The compact mark's box in stage units. */
    rect: { x: cx - ox * scale, y: cy - oy * scale, w: LOGO_VIEWBOX.w * scale, h: LOGO_VIEWBOX.h * scale },
    /** The SVG transform that places the compact mark (its own units) on the stage. */
    transform: `translate(${cx - ox * scale} ${cy - oy * scale}) scale(${scale})`,
  };
}

/** Centre of the compact mark in its own units. */
export const COMPACT_ORIGIN: Pt = [LOGO_VIEWBOX.w / 2, LOGO_VIEWBOX.h / 2];
