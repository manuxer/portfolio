/* Geometry of the compact mark, shared with the first-load intro (src/intro) so
   the intro's last frame lands on exactly the same shapes as the header logo. */
export const LOGO_VIEWBOX = { w: 464, h: 417 };
/** The dark "M" body: a block with a V notch cut from the top. */
export const LOGO_BODY_POINTS = [
  [1, 4],
  [231.5, 410],
  [463, 4],
  [463, 417],
  [1, 417],
] as const;
export const LOGO_BODY = `M${LOGO_BODY_POINTS.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
/** The notch triangle the stripes are clipped to: top-left, top-right, apex. */
export const LOGO_TRIANGLE = [
  [54, 2],
  [409.5, 2],
  [231.75, 316],
] as const;
export const LOGO_STRIPES = [
  { y: 0, h: 67.5, fill: "#F2BC41" },
  { y: 67.5, h: 65, fill: "#DB5240" },
  { y: 132.5, h: 69, fill: "#56A65D" },
  { y: 201.5, h: 120, fill: "#5B81C1" },
] as const;
