import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { Pause, Play, RotateCcw } from "lucide-react";
import { buildPrototype, createControl, parsePrototype, setPaused, type ParsedPrototype } from "@/sandbox/runtime";

const SCREEN_W = 390;
const SCREEN_H = 844;

const loaders = import.meta.glob<string>("../sandbox/prototypes/*.dc.html", { query: "?raw", import: "default" });

const cache = new Map<string, Promise<ParsedPrototype>>();
function loadPrototype(file: string) {
  let pending = cache.get(file);
  if (!pending) {
    const load = loaders[`../sandbox/prototypes/${file}`];
    if (!load) throw new Error(`Unknown prototype: ${file}`);
    pending = load().then(parsePrototype);
    cache.set(file, pending);
  }
  return pending;
}

/** Fonts are declared on the page: @font-face rules don't apply from inside a shadow root. */
function useFonts(hrefs: string[] | undefined) {
  useEffect(() => {
    hrefs?.forEach((href) => {
      if (document.head.querySelector(`link[data-sandbox-font="${CSS.escape(href)}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.sandboxFont = href;
      document.head.append(link);
    });
  }, [hrefs]);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The prototype renders in its own shadow root, so the site's styles can't reach in and its styles can't leak out. */
const BASE_CSS = `
.dc-root{all:initial;display:block;position:relative;width:${SCREEN_W}px;height:${SCREEN_H}px;overflow:hidden;background:#F5F5F7}
.dc-root.is-paused,.dc-root.is-paused *{animation-play-state:paused!important}
`;

interface PhonePlayerProps {
  file: string;
  label: string;
}

/**
 * A phone that plays one Sandbox prototype on a loop. It only runs while on
 * screen (and starts from the beginning each time it comes into view), and it
 * can be paused or replayed. With reduced motion requested it starts paused.
 */
export function PhonePlayer({ file, label }: PhonePlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);
  const [proto, setProto] = useState<ParsedPrototype | null>(null);
  const [scale, setScale] = useState(0.82);
  const [inView, setInView] = useState(false);
  const [paused, setPausedState] = useState(prefersReducedMotion);
  const [run, setRun] = useState(0);

  useFonts(proto?.fonts);

  useEffect(() => {
    let alive = true;
    loadPrototype(file).then((p) => alive && setProto(p));
    return () => {
      alive = false;
    };
  }, [file]);

  useEffect(() => {
    const host = hostRef.current;
    if (host) setShadow(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_W));
    resize.observe(frame);
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    visible.observe(frame);
    return () => {
      resize.disconnect();
      visible.disconnect();
    };
  }, []);

  // A fresh control and component per run, so Replay (and scrolling back into view) starts over.
  const { control, Prototype } = useMemo(() => {
    if (!proto) return { control: null, Prototype: null as ComponentType | null };
    const ctl = createControl(paused);
    return { control: ctl, Prototype: buildPrototype(proto, ctl) };
    // `paused` only seeds a new run; toggling it is handled below without rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proto, run, inView]);

  useEffect(() => {
    if (control) setPaused(control, paused);
  }, [control, paused]);

  return (
    <figure className="mx-auto w-full max-w-[320px]">
      <div className="rounded-[56px] bg-[#0c0c0d] p-[10px] shadow-[0_2px_4px_rgb(0_0_0/0.08),0_40px_80px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/10 dark:ring-white/15">
        <div
          ref={frameRef}
          className="relative overflow-hidden rounded-[46px] bg-[#F5F5F7]"
          style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}
          role="img"
          aria-label={`Animated prototype: ${label}`}
        >
          <div
            ref={hostRef}
            aria-hidden="true"
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})` }}
          />
          {shadow &&
            createPortal(
              <div className={paused ? "dc-root is-paused" : "dc-root"}>
                <style>{BASE_CSS + (proto?.css ?? "")}</style>
                {inView && Prototype && <Prototype key={run} />}
              </div>,
              shadow,
            )}
        </div>
      </div>
      <figcaption className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          className="btn btn-glass glass glass-soft btn-sm"
          onClick={() => setPausedState((p) => !p)}
          aria-label={paused ? `Play the ${label} prototype` : `Pause the ${label} prototype`}
        >
          {paused ? <Play size={15} strokeWidth={2.2} /> : <Pause size={15} strokeWidth={2.2} />}
          {paused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          className="btn btn-glass glass glass-soft btn-sm"
          onClick={() => {
            setRun((r) => r + 1);
            setPausedState(false);
          }}
          aria-label={`Replay the ${label} prototype from the start`}
        >
          <RotateCcw size={15} strokeWidth={2.2} />
          Replay
        </button>
      </figcaption>
    </figure>
  );
}
