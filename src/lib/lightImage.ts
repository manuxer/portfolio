/**
 * Dark mode renders mostly-white images (slides, light UI screenshots) as a
 * dark variant (see `img[data-tone="light"]` in index.css), so they don't read
 * as white panels. Classification samples the decoded image once on load:
 * "light" means most pixels are near-white and unsaturated, so photos,
 * colourful screens and dark screenshots are left alone.
 */

// Classified offline with the same rule, so it also works where a canvas
// can't read pixels (sandboxed previews, other origins).
const LIGHT_ASSETS = new Set(
  (
    "Figma ai-research alice-flow1 alice-flow2 alice-flow3 alice-responsive alice1 alice2 alice3 alice4 alice5 " +
    "alice6 ally aza3ways comms-case-status cs1 cs2 cs3 cs4 cs5 cs6 cs7 cs8 cs9 cs10 cs11 cs12 cs13 cs14 cs15 " +
    "cs16 ess h2 h3 h4 h5 h6 h7 h8 h9 h10 h11 h12 h13 h14 h15 h16 h17 h18 h19 h20 h21 h22 h23 h24 h25 hifi ia " +
    "layout manu-logo-qr personas process research userflow wireframes"
  ).split(" "),
);
const LIGHT_EXTERNAL = [
  "/files/USPS/usps_ux/usps-hero1.png",
  "/files/USPS/usps_ux/cx-at-usps.png",
  "/files/USPS/usps_ux/ux-steps.png",
  "/files/USPS/usps_ux/usps-heuristic.png",
  "/files/MBTA/img/tools.png",
  "/files/MBTA/img/MBTA-main.png",
  "/files/MBTA/img/report.png",
  "/files/Experiments/SwiftPay.png",
  ...Array.from({ length: 15 }, (_, i) => `/files/UW/${i + 1}.png`),
];

const cache = new Map<string, boolean>();
let ctx: CanvasRenderingContext2D | null | undefined;

/** Most pixels near-white and unsaturated. */
function sample(img: HTMLImageElement): boolean {
  try {
    ctx ??= Object.assign(document.createElement("canvas"), { width: 32, height: 32 }).getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return false;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 32, 32);
    ctx.drawImage(img, 0, 0, 32, 32);
    const data = ctx.getImageData(0, 0, 32, 32).data;
    let count = 0;
    for (let p = 0; p < data.length; p += 4) {
      const r = data[p], g = data[p + 1], b = data[p + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (lum > 0.8 && Math.max(r, g, b) - Math.min(r, g, b) < 32) count++;
    }
    return count / 1024 > 0.45;
  } catch {
    return false; // pixels not readable here
  }
}

function classify(img: HTMLImageElement): boolean {
  const file = decodeURI(img.currentSrc || img.src).split(/[?#]/)[0];
  const known = cache.get(file);
  if (known !== undefined) return known;
  // Built assets are "<name>-<8-char hash>.<ext>" (no hash in dev).
  const name = file.split("/").pop()!.replace(/(-[\w-]{8})?\.\w+$/, "");
  const light = file.includes("/assets/")
    ? LIGHT_ASSETS.has(name)
    : LIGHT_EXTERNAL.some((path) => file.endsWith(path)) || sample(img);
  cache.set(file, light);
  return light;
}

/** Tags a loaded image with data-tone="light" when it is mostly white. */
export function markTone(img: HTMLImageElement | null) {
  if (!img || !img.complete || img.naturalWidth === 0 || img.dataset.tone) return;
  img.dataset.tone = classify(img) ? "light" : "other";
}
