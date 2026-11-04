/**
 * First-load logo intro, in the manner of an Apple keynote title sequence (~5 s).
 *
 *   Act 1  The main (compact) logo appears at the centre in glass, in the manner of
 *          Apple's translucent UI: soft-edged pieces that refract the light stage behind
 *          them, clearing from frosted as they come into view.
 *   Act 2  The full "MANU" logo emerges out of it: the M eases back to its place while
 *          the A, N and U slide out from behind it, and the red, green and blue stripes
 *          leave the notch and reshape into the letters' accents. A light passes over it.
 *   Act 3  Everything folds back into the main logo, and the glass condenses into the
 *          light theme's flat logo.
 *   Act 4  The mark flattens into the header's flat logo and travels on a gentle arc
 *          into the header logo (FLIP, measured live) while the stage dissolves and the
 *          page rises in. Its last frame is the header logo's own geometry.
 *
 * Acts 1–3 render with three.js (scene3d.ts); without WebGL the flat mark plays Act 1
 * and Act 4 only. Plays once per session on the landing page (decided pre-paint in
 * index.html), is skippable (click, tap or any key fast-forwards to Act 4), and becomes
 * a 400 ms crossfade under prefers-reduced-motion. See src/intro/README.md.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { LOGO_BODY, LOGO_STRIPES, LOGO_TRIANGLE, LOGO_VIEWBOX } from "@/lib/logo";
import { claimIntro, endIntro, INTRO_SESSION_KEY, releaseIntroHold } from "@/lib/intro";
import { paintBackdrop, type Glow } from "./backdrop";
import { compactPlacement, STAGE } from "./geometry";
import { createScene3D, type Scene3D } from "./scene3d";
import "./intro.css";

gsap.registerPlugin(CustomEase);

/* ── Config: every duration, delay and easing in one place ───────────────────
   Times are seconds; `at` is relative to the start of its act. */
export const INTRO_CONFIG = {
  /** The header's compact logo the mark lands on, and the header that fades in around it. */
  headerLogo: ".site-logo",
  header: ".site-nav",
  /** Remember per browser session; set false to play on every load (previews). */
  oncePerSession: import.meta.env.VITE_ROUTER !== "memory",

  stage: {
    /** The light theme's page colour, with soft brand-coloured light behind the logo for the glass to refract. */
    background: "#fbfbfd",
    /** Glows: centre as fractions of the stage's width/height, radius as a fraction of its width. */
    glows: [
      { color: "#f2bc41", x: 0.28, y: 0.08, size: 0.44, opacity: 0.42 },
      { color: "#db5240", x: 0.66, y: 0.02, size: 0.4, opacity: 0.3 },
      { color: "#56a65d", x: 0.38, y: 1.02, size: 0.42, opacity: 0.3 },
      { color: "#5b81c1", x: 0.78, y: 0.88, size: 0.44, opacity: 0.36 },
    ] satisfies Glow[],
    /** The logo's flat colour: the light theme's text colour, as in the header. */
    ink: "#1d1d1f",
    /** Width of the stage the full logo sits in. */
    width: "min(88vw, 760px)",
    /** Size of the centred main logo, relative to the M in the full logo. */
    compactScale: 1.4,
  },

  /** The glass: thickness and rounded rims in logo units (the mark is 464 wide), camera. */
  look: {
    depth: 76,
    /** Rim radius across the face (it also rounds the corners) and in depth. */
    round: 12,
    roundDepth: 26,
    /** How far travelling stripes/accents lift towards the viewer, so nothing passes through anything. */
    lift: 60,
    fov: 26,
    glass: {
      /** Tint of the M and letters: dark, smoked glass (it settles to `stage.ink`). */
      body: "#4a4c55",
      /** The stripes' glass is tinted their colours, this much lighter (0–1). */
      stripes: 0.12,
      /** Clear (0) to frosted; Act 1 clears from `frost`. */
      roughness: 0.12,
      frost: 0.6,
      ior: 1.5,
      /** Rainbow fringing at the rims. */
      dispersion: 0.35,
    },
    /** Soft shadow behind the glass: how dark, how far down and how soft (stage units). */
    shadow: { opacity: 0.24, offset: 16, blur: 30 },
    /** If the 3D stage isn't ready to draw within this many ms (slow device), play the flat version. */
    readyWithin: 1200,
    /** If Act 1's frames take longer than this on average (ms), skip ahead to Act 4 rather than stutter. */
    slowFrame: 70,
  },

  /** Cubic-bézier easings (x1, y1, x2, y2). */
  ease: {
    out: [0.22, 1, 0.36, 1], // long, soft deceleration
    outExpo: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1], // for moves that start from rest
    arc: [0.3, 0.7, 0.4, 1], // leads the flight's sideways travel so the path curves
  },

  /** Act 1: the main logo appears at the centre, in glass that clears from frosted. */
  act1: {
    start: 0,
    ambient: { at: 0, duration: 1.1 },
    /** `blur` is for the flat version only (without WebGL). */
    mark: { at: 0.15, duration: 0.85, blur: 12, scale: 0.92 },
    clear: { at: 0.15, duration: 1.2 },
    /** The studio reflections drift (radians) until Act 2's sweep takes over. */
    light: { from: -1.8 },
  },

  /** Act 2: the full logo emerges out of it, then holds while a light passes over it. */
  act2: {
    start: 0.95,
    /** The M eases from the main logo's size and place to its place in the full logo. */
    mark: { at: 0, duration: 0.85 },
    /** The yellow stripe opens out into the M's yellow triangle. */
    notch: { at: 0.05, duration: 0.8 },
    /**
     * A, N, U slide out from behind the main logo in turn: from `fromX` (logo units from the
     * centre), this scale and depth, coming forward once clear of it.
     */
    letters: { at: 0.05, duration: 0.85, stagger: 0.05, fromX: 40, scale: 0.65, depth: 260 },
    /** Each letter's stripe leaves the notch with it and becomes its accent. */
    accents: { delay: 0, duration: 0.85 },
    /** The studio reflections turn (radians), so a highlight glides across the full logo. */
    sweep: { at: 1.05, duration: 0.75, from: -0.9, to: 0.9 },
  },

  /** Act 3: it folds back into the main logo, and the glass condenses into the flat logo. */
  act3: {
    start: 2.65,
    letters: { at: 0, duration: 0.7, stagger: 0.05 },
    accents: { delay: 0.03, duration: 0.7 },
    notch: { at: 0.08, duration: 0.65 },
    mark: { at: 0.05, duration: 0.72 },
    /** The rims sharpen, the glass turns solid and the light flat, so it matches the flat logo exactly. */
    settle: { at: 0.45, duration: 0.45 },
  },

  /** Act 4: flatten, fly into the header, reveal the page. Starts after ~0.15 s of stillness. */
  act4: {
    start: 3.55,
    /** The 3D mark flattens and hands over to the flat (header-identical) mark. */
    flatten: { at: 0, duration: 0.22 },
    /** Arc into the header: x leads and y follows, so the mark rises into its slot from below. */
    flight: { at: 0.15, duration: 1.3, easeX: "arc", easeY: "inOut", easeScale: "outExpo" },
    /** Stage background dissolves to the page. */
    dissolve: { at: 0.25, duration: 0.9 },
    /** Mark ink shifts to the header's colour (light theme). */
    ink: { at: 0.3, duration: 0.8 },
    /** Header fades in around the arriving mark. */
    header: { at: 0.6, duration: 0.7 },
    /** Page content starts rising in (hero headline → subtext → CTA → rest; cadence in lib/intro.ts). */
    page: { at: 0.45 },
    /** Once the mark has landed, it fades into the real header logo beneath it (same geometry). */
    handoff: { duration: 0.1 },
  },

  /** Without WebGL the flat mark plays Act 1, holds, and Act 4 starts here. */
  flat: { act4Start: 1.5 },
  reducedMotion: { fade: 0.4 },
  /** Skipping fast-forwards smoothly to Act 4 at this speed. */
  skip: { timeScale: 5 },
} as const;

type EaseName = keyof typeof INTRO_CONFIG.ease;
const easeId = (name: EaseName) => `intro-${name}`;
for (const [name, [x1, y1, x2, y2]] of Object.entries(INTRO_CONFIG.ease)) {
  CustomEase.create(easeId(name as EaseName), `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
}

const cfg = INTRO_CONFIG;
const placement = compactPlacement(cfg.stage.compactScale);
const viewBox = `${STAGE.x} ${STAGE.y} ${STAGE.w} ${STAGE.h}`;
const [[tx0, ty0], [tx1], [tax, tay]] = LOGO_TRIANGLE;
const triangle = `M${tx0} ${ty0}H${tx1}L${tax} ${tay}Z`;

export default function Intro() {
  const overlay = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const host3d = useRef<HTMLDivElement>(null);
  const ambient = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (!claimIntro()) {
      endIntro();
      setDone(true);
      return;
    }
    if (cfg.oncePerSession) {
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        /* private mode: the intro may play again, which is harmless */
      }
    }

    const el = overlay.current!;
    const q = gsap.utils.selector(el);
    const header = document.querySelector<HTMLElement>(cfg.header);
    const headerLogo = document.querySelector<SVGElement>(cfg.headerLogo);
    let finished = false;
    let detach = () => {};
    let scene: Scene3D | null = null;
    let draw = () => {};
    const dispose3d = () => {
      if (!scene) return;
      gsap.ticker.remove(draw);
      scene.dispose();
      scene = null;
    };
    // The page under the stage can't take focus until it's handed over (Tab would otherwise
    // scroll the hidden page); the overlay itself is aria-hidden and has nothing focusable.
    const page = [...(el.parentElement?.children ?? [])].filter((n): n is HTMLElement => n !== el && n instanceof HTMLElement);
    const setInert = (on: boolean) => page.forEach((n) => (n.inert = on));

    const finish = () => {
      if (finished) return;
      finished = true;
      detach();
      dispose3d();
      setInert(false);
      el.style.visibility = "hidden";
      endIntro();
      if (header) gsap.set(header, { clearProps: "opacity" });
      if (headerLogo) gsap.set(headerLogo, { clearProps: "visibility" });
      gsap.set(document.documentElement, { clearProps: "backgroundColor" });
      setDone(true);
    };

    // prefers-reduced-motion: no logo motion, just a short crossfade to the page.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !headerLogo) {
      gsap.set(q(".intro-frame"), { autoAlpha: 0 });
      endIntro();
      const tween = gsap.to(el, { autoAlpha: 0, duration: cfg.reducedMotion.fade, ease: "none", onComplete: finish });
      return () => void tween.kill();
    }

    setInert(true);
    const paint = () =>
      paintBackdrop(ambient.current!, el.getBoundingClientRect(), frame.current!.getBoundingClientRect(), cfg.stage.background, cfg.stage.glows);
    paint();
    let ctx: gsap.Context | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let cancelled = false;
    const review = /[?&]intro\b/.test(location.search);
    // The GPU dropped the 3D, or can't keep up: carry on from Act 4 with the flat mark.
    const toAct4 = () => {
      if (scene && timeline && timeline.time() < timeline.labels.act4) timeline.seek(timeline.labels.act4 - 0.001, false);
    };
    const start = (s3d: Scene3D | null) => {
      if (cancelled || ctx) {
        s3d?.dispose();
        return;
      }
      scene = s3d;
      ctx = gsap.context(() => {
        const tl = (timeline = gsap.timeline({ onComplete: finish }));
        // ?intro (replay for review) also exposes the timeline for scrubbing in devtools.
        if (review) Object.assign(window, { __introTimeline: tl });
        const { act1: a1, act2: a2, act3: a3, act4: a4 } = cfg;
        tl.addLabel("act1", a1.start).addLabel("act4", scene ? a4.start : cfg.flat.act4Start);

        tl.fromTo(
          ".intro-ambient",
          { opacity: 0 },
          { opacity: 1, duration: a1.ambient.duration, ease: easeId("out") },
          `act1+=${a1.ambient.at}`,
        );

        if (scene) {
          const s = scene;
          s.resize();
          // Draw every tick; time Act 1's first frames (not in review mode, which may run in software).
          const watch = { frames: review ? -1 : 0, since: 0 };
          draw = () => {
            s.render();
            if (watch.frames < 0) return;
            const now = performance.now();
            if (watch.frames++ === 0) watch.since = now;
            else if (watch.frames === 16) {
              watch.frames = -1;
              if ((now - watch.since) / 15 > cfg.look.slowFrame) toAct4();
            }
          };
          gsap.ticker.add(draw);
          tl.addLabel("act2", a2.start).addLabel("act3", a3.start);

          /* Act 1: the main logo appears at the centre, its glass clearing from frosted. */
          // Opacity from the warm-up's (intro.css); the backdrop in the canvas matches the page's.
          tl.to(s.canvas, { opacity: 1, duration: a1.mark.duration, ease: easeId("out") }, `act1+=${a1.mark.at}`);
          tl.fromTo(
            s.root.scale,
            { x: a1.mark.scale, y: a1.mark.scale, z: a1.mark.scale },
            { x: 1, y: 1, z: 1, duration: a1.mark.duration, ease: easeId("out") },
            `act1+=${a1.mark.at}`,
          );
          tl.fromTo(s.frost, { t: 1 }, { t: 0, duration: a1.clear.duration, ease: easeId("out") }, `act1+=${a1.clear.at}`);
          tl.fromTo(
            s.environment,
            { yaw: a1.light.from },
            { yaw: a2.sweep.from, duration: a2.start + a2.sweep.at - a1.start, ease: "none" },
            "act1",
          );

          /* Act 2: the full logo emerges out of it. */
        const letters = s.bodies;
        const L2 = a2.letters;
        const inside = (i: number) => ({ x: L2.fromX, y: s.homes[i].y, z: -L2.depth });
        const small = { x: L2.scale, y: L2.scale, z: L2.scale };
        const letterAt = (i: number) => `act2+=${L2.at + i * L2.stagger}`;
        tl.to(s.mark.position, { x: 0, duration: a2.mark.duration, ease: easeId("inOut") }, `act2+=${a2.mark.at}`);
        tl.to(s.mark.scale, { x: 1, y: 1, z: 1, duration: a2.mark.duration, ease: easeId("inOut") }, `act2+=${a2.mark.at}`);
        tl.to(s.notch, { t: 1, duration: a2.notch.duration, ease: easeId("inOut") }, `act2+=${a2.notch.at}`);
        letters.forEach((m, i) => {
          const home = s.homes[i];
          tl.set(m, { visible: true }, letterAt(i));
          // Out from behind the main logo: across first, forward once clear of it.
          tl.fromTo(m.position, { x: inside(i).x, y: home.y }, { x: home.x, y: home.y, duration: L2.duration, ease: easeId("out") }, letterAt(i));
          tl.fromTo(m.position, { z: inside(i).z }, { z: 0, duration: L2.duration, ease: easeId("inOut") }, letterAt(i));
          tl.fromTo(m.scale, small, { x: 1, y: 1, z: 1, duration: L2.duration, ease: easeId("out") }, letterAt(i));
        });
        s.accents.forEach((acc) => {
          tl.to(acc, { t: 1, duration: a2.accents.duration, ease: easeId("inOut") }, `act2+=${L2.at + acc.letter * L2.stagger + a2.accents.delay}`);
        });
        // The light sweep: the studio reflections turn, so a highlight glides across the gloss.
        tl.to(s.environment, { yaw: a2.sweep.to, duration: a2.sweep.duration, ease: easeId("inOut") }, `act2+=${a2.sweep.at}`);

        /* Act 3: it folds back into the main logo (last out, first in). */
        const L3 = a3.letters;
        const backAt = (i: number) => `act3+=${L3.at + (letters.length - 1 - i) * L3.stagger}`;
        letters.forEach((m, i) => {
          // Back first, so they pass behind the M, then across into it.
          tl.to(m.position, { z: inside(i).z, duration: L3.duration, ease: easeId("out") }, backAt(i));
          tl.to(m.position, { x: inside(i).x, duration: L3.duration, ease: easeId("inOut") }, backAt(i));
          tl.to(m.scale, { ...small, duration: L3.duration, ease: easeId("inOut") }, backAt(i));
          tl.set(m, { visible: false }, `act3+=${L3.at + (letters.length - 1 - i) * L3.stagger + L3.duration}`);
        });
        s.accents.forEach((acc) => {
          tl.to(
            acc,
            { t: 0, duration: a3.accents.duration, ease: easeId("inOut") },
            `act3+=${L3.at + (letters.length - 1 - acc.letter) * L3.stagger + a3.accents.delay}`,
          );
        });
        tl.to(s.notch, { t: 0, duration: a3.notch.duration, ease: easeId("inOut") }, `act3+=${a3.notch.at}`);
        tl.to(s.mark.position, { x: s.compact.x, duration: a3.mark.duration, ease: easeId("inOut") }, `act3+=${a3.mark.at}`);
        tl.to(
          s.mark.scale,
          { x: s.compact.scale, y: s.compact.scale, z: s.compact.scale, duration: a3.mark.duration, ease: easeId("inOut") },
          `act3+=${a3.mark.at}`,
        );
        tl.to(s.settle, { t: 1, duration: a3.settle.duration, ease: easeId("inOut") }, `act3+=${a3.settle.at}`);

        /* Act 4 (start): flatten the 3D mark into the flat one — same outline, same place. */
          tl.to(s.root.scale, { z: 0.02, duration: a4.flatten.duration, ease: easeId("out") }, `act4+=${a4.flatten.at}`);
          // The flat mark (on top) fades in over the 3D one, then the 3D one goes: no dip in between.
          tl.fromTo(".intro-flat", { opacity: 0 }, { opacity: 1, duration: a4.flatten.duration, ease: "none" }, `act4+=${a4.flatten.at}`);
          tl.set(s.canvas, { opacity: 0 }, `act4+=${a4.flatten.at + a4.flatten.duration}`);
          tl.call(dispose3d, undefined, `act4+=${a4.flatten.at + a4.flatten.duration}`);
        } else {
          /* No WebGL: the flat mark resolves at the centre, holds, then Act 4. */
          tl.fromTo(
            ".intro-flat",
            { opacity: 0, scale: a1.mark.scale, filter: `blur(${a1.mark.blur}px)` },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: a1.mark.duration, ease: easeId("out") },
            `act1+=${a1.mark.at}`,
          );
          tl.set(".intro-flat", { filter: "none" }, `act1+=${a1.mark.at + a1.mark.duration}`);
        }

        /* Act 4: converge to the header and reveal the page. */
        tl.set(el, { pointerEvents: "none" }, "act4");

        // FLIP: map the main logo's box on the stage onto the header logo's box, measured
        // live (and again on resize). Origin is the stage's top-left; x/y/scale ease separately.
        const rect = placement.rect;
        let from = { left: 0, top: 0, ppu: 1 };
        let to = { x: 0, y: 0, w: 1 };
        const measure = () => {
          const f = frame.current!.getBoundingClientRect(); // untransformed twin of the stage
          const h = headerLogo.getBoundingClientRect();
          from = { left: f.left, top: f.top, ppu: f.width / STAGE.w };
          to = { x: h.left + h.width / 2, y: h.top + h.height / 2, w: h.width };
        };
        const fl = a4.flight;
        const ex = gsap.parseEase(easeId(fl.easeX));
        const ey = gsap.parseEase(easeId(fl.easeY));
        const es = gsap.parseEase(easeId(fl.easeScale));
        const flight = { t: 0 };
        const applyFlight = () => {
          const { left, top, ppu } = from;
          const cx = (rect.x + rect.w / 2 - STAGE.x) * ppu; // main logo's centre within the stage, px
          const cy = (rect.y + rect.h / 2 - STAGE.y) * ppu;
          const s = 1 + (to.w / (rect.w * ppu) - 1) * es(flight.t);
          const px = left + cx + (to.x - (left + cx)) * ex(flight.t);
          const py = top + cy + (to.y - (top + cy)) * ey(flight.t);
          stage.current!.style.transform = `translate(${px - left - s * cx}px, ${py - top - s * cy}px) scale(${s})`;
        };
        tl.call(
          () => {
            measure();
            // Read now, not at mount: the theme may have changed during the intro.
            gsap.set(q(".intro-m-ink"), { attr: { fill: getComputedStyle(headerLogo).color } });
          },
          undefined,
          "act4",
        );
        tl.to(flight, { t: 1, duration: fl.duration, ease: "none", onUpdate: applyFlight }, `act4+=${fl.at}`);

        // Light theme: the white-on-black mark takes on the header's ink as the stage dissolves.
        tl.to(".intro-m-ink", { opacity: 1, duration: a4.ink.duration, ease: easeId("out") }, `act4+=${a4.ink.at}`);
        // Once the ink copy is opaque, drop the light copy so its anti-aliased edge can't show.
        tl.set(".intro-m-body", { opacity: 0 }, `act4+=${a4.ink.at + a4.ink.duration}`);

        tl.to(
          [".intro-bg", ".intro-ambient"],
          { opacity: 0, duration: a4.dissolve.duration, ease: easeId("out") },
          `act4+=${a4.dissolve.at}`,
        );
        // The scrollbar gutter is painted black with the stage (index.html); it dissolves with it.
        tl.to(
          document.documentElement,
          { backgroundColor: () => getComputedStyle(document.body).backgroundColor, duration: a4.dissolve.duration, ease: easeId("out") },
          `act4+=${a4.dissolve.at}`,
        );
        if (header) {
          tl.fromTo(
            header,
            { opacity: 0 },
            { opacity: 1, duration: a4.header.duration, ease: easeId("out") },
            `act4+=${a4.header.at}`,
          );
        }
        tl.call(
          () => {
            setInert(false);
            releaseIntroHold();
          },
          undefined,
          `act4+=${a4.page.at}`,
        );

        // Hand-off: the mark has landed exactly on the header logo; show the real one beneath it
        // and fade the mark out, so even sub-pixel anti-aliasing differences never "pop".
        const landed = `act4+=${fl.at + fl.duration}`;
        tl.set(headerLogo, { visibility: "visible" }, landed);
        tl.to(stage.current, { opacity: 0, duration: a4.handoff.duration, ease: "none" }, landed);

        // Skip: fast-forward smoothly to Act 4, then carry on at normal speed.
        tl.call(() => void tl.timeScale(1), undefined, "act4");
        const skip = () => {
          if (tl.time() < tl.labels.act4) tl.timeScale(cfg.skip.timeScale);
        };
        const onResize = () => {
          if (finished) return;
          paint();
          if (scene) scene.resize();
          if (tl.time() >= tl.labels.act4) {
            measure();
            applyFlight();
          }
        };
        el.addEventListener("pointerdown", skip);
        window.addEventListener("keydown", skip);
        window.addEventListener("resize", onResize);
        detach = () => {
          el.removeEventListener("pointerdown", skip);
          window.removeEventListener("keydown", skip);
          window.removeEventListener("resize", onResize);
        };
        return () => detach();
      }, el);
    };

    // The black stage is already showing; the 3D logo starts once it can draw without stalling,
    // counting the time it takes to set up. Review mode (?intro) also runs on a software
    // renderer and waits as long as it takes, so slow test machines still show the 3D.
    const setupStart = performance.now();
    let tooSlow = 0;
    const fallBack = () => {
      clearTimeout(tooSlow);
      s3d?.dispose();
      start(null);
    };
    const s3d = createScene3D(host3d.current!, frame.current!, ambient.current!, { ...cfg.look, ink: cfg.stage.ink }, cfg.stage.compactScale, {
      allowSoftware: review,
      // The GPU dropped the canvas: before the 3D starts, play the flat version; during it, go to Act 4.
      onLost: () => (ctx ? toAct4() : fallBack()),
    });
    if (!s3d) start(null);
    else {
      const left = cfg.look.readyWithin - (performance.now() - setupStart);
      if (!review && left <= 0) fallBack();
      else if (!review) tooSlow = window.setTimeout(fallBack, left);
      s3d.ready.then(
        () => {
          clearTimeout(tooSlow);
          start(s3d); // does nothing (but dispose it) if the flat version already started
        },
        fallBack,
      );
    }

    return () => {
      cancelled = true;
      clearTimeout(tooSlow);
      ctx?.revert();
      dispose3d();
      s3d?.dispose(); // one that never started
      setInert(false);
      // A real unmount mid-intro (not React's dev double-mount) must not leave the page hidden.
      setTimeout(() => !el.isConnected && !finished && endIntro(), 100);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlay}
      className="intro"
      aria-hidden="true"
      style={{ "--intro-bg": cfg.stage.background } as CSSProperties}
    >
      <div className="intro-bg" />
      <canvas ref={ambient} className="intro-ambient" />
      {/* Acts 1–3: the 3D logo (three.js canvas over the whole stage, backdrop included). */}
      <div ref={host3d} className="intro-3d" />
      <div ref={frame} className="intro-frame" style={{ width: cfg.stage.width, aspectRatio: `${STAGE.w} / ${STAGE.h}` }}>
        <div ref={stage} className="intro-stage">
          {/* Act 4: the flat main logo, identical to the header logo, placed where the 3D one ends. */}
          <svg viewBox={viewBox} className="intro-layer intro-flat" style={{ transformOrigin: "50% 50%" }}>
            <defs>
              <clipPath id="intro-flat-notch">
                <path d={triangle} />
              </clipPath>
            </defs>
            <g transform={placement.transform}>
              <path className="intro-m-body" d={LOGO_BODY} fill={cfg.stage.ink} />
              <path className="intro-m-ink" d={LOGO_BODY} fill={cfg.stage.ink} opacity="0" />
              <g clipPath="url(#intro-flat-notch)">
                {LOGO_STRIPES.map((s) => (
                  <rect key={s.fill} x="0" y={s.y} width={LOGO_VIEWBOX.w} height={s.h} fill={s.fill} />
                ))}
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
