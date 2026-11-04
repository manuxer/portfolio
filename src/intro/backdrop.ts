/**
 * The stage's light backdrop: a base colour and soft brand-coloured glows, placed relative
 * to the stage so they sit behind the logo at any viewport size. One 2D canvas is both the
 * page layer behind the 3D stage and the picture the glass refracts (scene3d.ts), so the
 * two always match.
 */
export interface Glow {
  color: string;
  /** Centre, as fractions of the stage's width and height (may lie outside 0–1). */
  x: number;
  y: number;
  /** Radius, as a fraction of the stage's width. */
  size: number;
  opacity: number;
}

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16} ${(n >> 8) & 255} ${n & 255} / ${a})`;
};

/** A soft, roughly Gaussian falloff from the centre (offset, share of the glow's opacity). */
const FALLOFF = [
  [0, 1],
  [0.2, 0.86],
  [0.4, 0.58],
  [0.6, 0.3],
  [0.8, 0.1],
  [1, 0],
] as const;

export function paintBackdrop(canvas: HTMLCanvasElement, view: DOMRect, stage: DOMRect, base: string, glows: readonly Glow[]) {
  const w = Math.max(1, Math.round(view.width));
  const h = Math.max(1, Math.round(view.height));
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (!g) return;
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  for (const glow of glows) {
    const cx = stage.left - view.left + glow.x * stage.width;
    const cy = stage.top - view.top + glow.y * stage.height;
    const r = glow.size * stage.width;
    const fill = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    for (const [at, share] of FALLOFF) fill.addColorStop(at, rgba(glow.color, glow.opacity * share));
    g.fillStyle = fill;
    g.fillRect(0, 0, w, h);
  }
  // A whisper of noise, so the soft gradients don't band.
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 3;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
}
