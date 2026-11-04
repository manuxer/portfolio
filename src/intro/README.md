# First-load logo intro

A ~5 s Apple-keynote-style title sequence on the landing page:

The logo is made of glass, in the manner of Apple's translucent "Liquid Glass" UI: soft,
rounded pieces on the light theme's stage (the M and letters in dark, smoked glass, the
stripes in coloured glass), refracting a backdrop of brand-coloured light and casting a
soft shadow. It faces the viewer throughout.

1. **Act 1** – the main (compact) logo appears at the centre, its glass clearing from
   frosted.
2. **Act 2** – the full "MANU" logo emerges out of it: the M eases to its place, the
   A, N and U slide out from behind it in turn, and the red, green and blue stripes lift
   out of the notch and reshape into the letters' accents. It holds while a highlight
   glides across the glass.
3. **Act 3** – everything folds back into the main logo (last letter first), and the glass
   condenses into the light theme's flat logo: the rims sharpen, the glass turns solid and
   the light flat, so its outline and colours become exactly the flat logo's.
4. **Act 4** – it flattens into the header's flat logo and flies into the header logo
   while the page rises in.

| File | What it holds |
| --- | --- |
| `Intro.tsx` | `INTRO_CONFIG` (every duration, delay, easing, colour, selector, the 3D look), the GSAP timeline, the overlay markup |
| `scene3d.ts` | The 3D stage (three.js): rounded glass pieces, their shadow, lights, morphs |
| `backdrop.ts` | Paints the stage's light backdrop and glows (the page layer and what the glass refracts) |
| `geometry.ts` | The full logo's shapes and how they map onto the compact mark |
| `intro.css` | Overlay styles |
| `../lib/intro.ts` | Coordination with the page (hold/release entrance animations, failsafes) |
| `../lib/logo.ts` | The compact mark's geometry, shared with the header `<Logo>` |
| `../../index.html` | Pre-paint decision + cover (inline `<style>` and `<script>`) |

## Behaviour

- **When it plays:** landing page only, once per browser session (`sessionStorage`
  key `manuxer:intro`). Add `?intro` to any URL to replay it (handy for review); that
  also exposes the timeline as `window.__introTimeline` for scrubbing in devtools.
- **Skip:** click, tap or any key fast-forwards smoothly to Act 4 (`skip.timeScale`).
- **Reduced motion:** a 400 ms crossfade from the stage to the page.
- **Theme:** the stage is always the light theme's. In dark mode it dissolves into the dark
  page and the mark takes on the header's light ink as it lands.
- **No WebGL, a software renderer, or a slow device:** the flat main logo plays Act 1
  and Act 4 only. "Slow" means the 3D stage can't be set up and draw within
  `look.readyWithin` (1.2 s, counted from the start of set-up). If the GPU drops the
  canvas mid-intro, or can't keep up in Act 1 (`look.slowFrame`), it goes straight to
  Act 4.
- **Review mode (`?intro`)** also runs the 3D on a software renderer and waits as long as
  set-up takes, so it can be checked on machines without a GPU.
- **Fallback:** without JavaScript nothing changes. If the intro's script can't load,
  the page shows anyway (import failure, plus timeouts in `index.html` and `lib/intro.ts`).
- **Page handoff:** while the intro covers the page, `Reveal`, `WordsReveal`,
  `Stagger` and the hero character hold their start state; the intro releases them in
  Act 4 and the hero rises in on a quicker cadence (headline → subtext → CTA → rest).
  The header fades in around the arriving mark; the header logo stays `visibility:
  hidden` until the mark lands on it.
- **Weight:** the intro (GSAP + three.js) is its own chunk (~175 kB gzipped), fetched
  only when the intro will play; the rest of the site doesn't load it.

## Tuning

Everything is in `INTRO_CONFIG` at the top of `Intro.tsx`: each act has a `start`
(its label on the timeline) and each move an `at` (offset within the act), a
`duration`, and where relevant an easing name from `ease` (cubic-bézier values).
`stage` sets the light backdrop (`background`, `glows`), the logo's flat `ink`, and the
sizes of the full logo (`width`) and main logo (`compactScale`). `look` sets the glass:
thickness (`depth`), how round its rims are (`round` across the face, which also rounds
the corners, and `roundDepth`), how far travelling accents `lift` towards you, camera
`fov` (lower is flatter), `glass` (tint, frost, refraction, rainbow fringing, how light
the coloured stripes are) and `shadow`. In Act 2, `letters.fromX` is where the letters
start (logo units from the centre, behind the mark) and `sweep` turns the studio
reflections; Act 3's `settle` condenses the glass into the flat logo.

## Swapping in your own artwork

All shapes are polygons in one coordinate system ("logo units"), the compact mark's
own: its viewBox is `0 0 464 417`.

1. **Compact mark** (also the header logo): edit `LOGO_BODY_POINTS`, `LOGO_TRIANGLE`
   and `LOGO_STRIPES` in `src/lib/logo.ts`. The header `<Logo>`, the flat mark and the
   3D mark all read them, so the last frame always matches the header.
2. **Full logo:** edit `FULL_LETTERS` in `geometry.ts`. Each letter has a `body`
   (light shape that slides out of the mark), one or more `accents` (coloured shapes)
   and the `stripe` index its accents travel to and from. Accents and stripes should be
   convex (their in-between shapes are convex blends); bodies can be any simple polygon.
3. The M is assumed to be the compact mark's body. If your shared shape differs, give
   it its own morph in `scene3d.ts`, like `notch`.
4. `STAGE` (in `geometry.ts`) is the box around the full logo; enlarge it if your
   compact mark grows beyond it (`stage.compactScale`).

## Changing the header

The intro lands on `INTRO_CONFIG.headerLogo` (`.site-logo`, the `<Logo>` in
`Navbar.tsx`) and fades in `INTRO_CONFIG.header` (`.site-nav`). If you rename them,
update the matching selectors in the inline `<style>` in `index.html` too (they hide
the header logo and header before the first paint).

## Turning it off

Remove the inline `<script>` that adds `intro-pending` in `index.html`; nothing else
runs (the intro chunk is only fetched when that class is present).
