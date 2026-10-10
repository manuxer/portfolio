import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { isPicture, srcOf, srcSetOf } from "@/lib/image";
import { cn } from "@/lib/cn";
import { LightboxContext, type LightboxItem } from "@/components/lightbox-context";
import { ease } from "@/lib/motion";
import { lockScroll } from "@/lib/scrollLock";

interface Session {
  id: number;
  items: LightboxItem[];
  index: number;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const thumbs = useRef(new Map<string, HTMLElement>());
  const [session, setSession] = useState<Session | null>(null);
  const [hiddenKey, setHiddenKey] = useState<string | null>(null);

  const register = useCallback((key: string, el: HTMLElement | null) => {
    if (el) thumbs.current.set(key, el);
    else thumbs.current.delete(key);
  }, []);

  const getThumb = useCallback((key: string) => thumbs.current.get(key) ?? null, []);

  const open = useCallback((items: LightboxItem[], index: number) => {
    setSession({ id: Date.now(), items, index });
    setHiddenKey(items[index].key);
  }, []);

  const onClosed = useCallback(
    (key: string) => {
      setSession(null);
      setHiddenKey(null);
      // Wait for the thumbnail to become visible again before focusing it.
      requestAnimationFrame(() => getThumb(key)?.focus({ preventScroll: true }));
    },
    [getThumb],
  );

  const value = useMemo(() => ({ open, register, hiddenKey }), [open, register, hiddenKey]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {session &&
        createPortal(
          <Lightbox
            key={session.id}
            items={session.items}
            startIndex={session.index}
            getThumb={getThumb}
            onActiveChange={setHiddenKey}
            onClosed={onClosed}
          />,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}

/* ───────────────────────── geometry ───────────────────────── */

interface Viewport {
  w: number;
  h: number;
}

interface Box {
  left: number;
  top: number;
  w: number;
  h: number;
}

const PAGE_GAP = 48;
const THUMB_RADIUS = 22;
const FRAME_RADIUS = 14;

const readViewport = (): Viewport => ({ w: window.innerWidth, h: window.innerHeight });

function useViewport() {
  const [vp, setVp] = useState(readViewport);
  useEffect(() => {
    const onResize = () => setVp(readViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vp;
}

/** Largest box with the image's aspect ratio that fits between the controls. */
function fit(aspect: number, vp: Viewport): Box {
  const mobile = vp.w < 640;
  const padX = mobile ? 0 : 96;
  const padTop = mobile ? 72 : 80;
  const padBottom = mobile ? 96 : 80;
  const maxW = vp.w - padX * 2;
  const maxH = vp.h - padTop - padBottom;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { left: (vp.w - w) / 2, top: padTop + (maxH - h) / 2, w, h };
}

function aspectOf(item: LightboxItem, thumb: HTMLElement | null) {
  if (isPicture(item.src)) return item.src.img.w / item.src.img.h;
  const img = thumb?.querySelector("img");
  if (img?.naturalWidth) return img.naturalWidth / img.naturalHeight;
  const rect = thumb?.getBoundingClientRect();
  if (rect?.height) return rect.width / rect.height;
  return 16 / 9;
}

/** Transform that makes `box` sit exactly on top of `thumb`. */
function morphFrom(thumb: HTMLElement, box: Box) {
  const r = thumb.getBoundingClientRect();
  const scale = r.width / box.w;
  return {
    x: r.left + r.width / 2 - (box.left + box.w / 2),
    y: r.top + r.height / 2 - (box.top + box.h / 2),
    scale,
    radius: THUMB_RADIUS / scale,
  };
}

const openSpring = { type: "spring", visualDuration: 0.5, bounce: 0.12 } as const;
const closeTween = { duration: 0.42, ease: ease.spring } as const;
const pageSpring = { type: "spring", stiffness: 320, damping: 36 } as const;

/* ───────────────────────── viewer ───────────────────────── */

interface LightboxProps {
  items: LightboxItem[];
  startIndex: number;
  getThumb: (key: string) => HTMLElement | null;
  onActiveChange: (key: string) => void;
  onClosed: (key: string) => void;
}

function Lightbox({ items, startIndex, getThumb, onActiveChange, onClosed }: LightboxProps) {
  const reduced = useReducedMotion();
  const vp = useViewport();
  const pageW = vp.w + PAGE_GAP;

  const [index, setIndex] = useState(startIndex);
  const indexRef = useRef(startIndex);
  const closing = useRef(false);
  const panned = useRef(false);
  const panAxis = useRef<"x" | "y" | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Opening pose: the start slide sits exactly on its thumbnail.
  const [start] = useState(() => {
    const thumb = getThumb(items[startIndex].key);
    if (!thumb || reduced) return null;
    return morphFrom(thumb, fit(aspectOf(items[startIndex], thumb), readViewport()));
  });

  const x = useMotionValue(start?.x ?? 0);
  const y = useMotionValue(start?.y ?? 0);
  const scale = useMotionValue(start?.scale ?? 0.94);
  const radius = useMotionValue(start?.radius ?? FRAME_RADIUS);
  const frameOpacity = useMotionValue(start ? 1 : 0);
  const trackX = useMotionValue(-startIndex * pageW);
  const backdrop = useMotionValue(0);
  const chrome = useMotionValue(0);
  // Dragging toward dismissal lets the page show through.
  const backdropOpacity = useTransform(() => backdrop.get() * (1 - Math.min(Math.abs(y.get()) / 520, 0.7)));

  const box = fit(aspectOf(items[index], getThumb(items[index].key)), vp);

  useEffect(() => {
    const controls = [
      animate(x, 0, openSpring),
      animate(y, 0, openSpring),
      animate(scale, 1, openSpring),
      animate(radius, FRAME_RADIUS, openSpring),
      animate(frameOpacity, 1, { duration: 0.25 }),
      animate(backdrop, 1, { duration: 0.45, ease: ease.out }),
      animate(chrome, 1, { duration: 0.35, delay: 0.18, ease: ease.out }),
    ];
    closeRef.current?.focus({ preventScroll: true });
    return () => controls.forEach((c) => c.stop());
  }, [x, y, scale, radius, frameOpacity, backdrop, chrome]);

  useEffect(() => lockScroll(), []);

  // Real modality: while open, the page behind can't be reached by Tab or a screen reader.
  useEffect(() => {
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    return () => root?.removeAttribute("inert");
  }, []);

  // Keep the track aligned when the window resizes.
  useEffect(() => {
    trackX.jump(-indexRef.current * pageW);
  }, [pageW, trackX]);

  const goTo = useCallback(
    (next: number, velocity = 0) => {
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      indexRef.current = clamped;
      setIndex(clamped);
      onActiveChange(items[clamped].key);
      animate(trackX, -clamped * pageW, { ...pageSpring, velocity });
    },
    [items, onActiveChange, pageW, trackX],
  );

  const close = useCallback(async () => {
    if (closing.current) return;
    closing.current = true;
    const item = items[indexRef.current];
    const thumb = getThumb(item.key);

    const fades = [
      animate(backdrop, 0, { duration: 0.36, ease: ease.out }),
      animate(chrome, 0, { duration: 0.16 }),
    ];

    if (thumb && !reduced) {
      // Bring the thumbnail on screen so the image has somewhere to land.
      const rect = thumb.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        thumb.scrollIntoView({ block: "center", behavior: "instant" });
      }
      const target = morphFrom(thumb, fit(aspectOf(item, thumb), readViewport()));
      await Promise.all([
        ...fades,
        animate(x, target.x, closeTween),
        animate(y, target.y, closeTween),
        animate(scale, target.scale, closeTween),
        animate(radius, target.radius, closeTween),
      ]);
    } else {
      await Promise.all([
        ...fades,
        animate(frameOpacity, 0, { duration: 0.22 }),
        animate(scale, 0.94, { duration: 0.22 }),
      ]);
    }
    onClosed(item.key);
  }, [items, getThumb, backdrop, chrome, reduced, x, y, scale, radius, frameOpacity, onClosed]);

  // Keyboard: arrows page, Escape closes, Tab stays inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        void close();
      } else if (e.key === "ArrowRight") {
        goTo(indexRef.current + 1);
      } else if (e.key === "ArrowLeft") {
        goTo(indexRef.current - 1);
      } else if (e.key === "Tab" && dialogRef.current) {
        // Only controls that are actually rendered (prev/next hide at the ends).
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
        ).filter((el) => el.getClientRects().length > 0);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, goTo]);

  /* Gestures: one pan, locked to whichever axis moves first.
     Horizontal pages through images; vertical drags to dismiss. */

  const onPanStart = (_: PointerEvent, info: PanInfo) => {
    if (closing.current) return;
    panned.current = true;
    panAxis.current = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? "x" : "y";
  };

  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (closing.current) return;
    if (panAxis.current === "x") {
      const atEdge =
        (indexRef.current === 0 && info.offset.x > 0) ||
        (indexRef.current === items.length - 1 && info.offset.x < 0);
      trackX.set(-indexRef.current * pageW + info.offset.x * (atEdge ? 0.3 : 1));
    } else if (panAxis.current === "y") {
      x.set(info.offset.x * 0.25);
      y.set(info.offset.y);
    }
  };

  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    if (closing.current) return;
    const axis = panAxis.current;
    panAxis.current = null;
    if (axis === "x") {
      const { offset, velocity } = info;
      const flick = Math.abs(velocity.x) > 450;
      const far = Math.abs(offset.x) > vp.w * 0.18;
      const step = flick || far ? (offset.x < 0 ? 1 : -1) : 0;
      goTo(indexRef.current + step, velocity.x);
    } else if (axis === "y") {
      if (Math.abs(info.offset.y) > 120 || Math.abs(info.velocity.y) > 700) {
        void close();
      } else {
        animate(x, 0, pageSpring);
        animate(y, 0, pageSpring);
      }
    }
  };

  const onStageClick = (e: MouseEvent) => {
    if (panned.current) {
      panned.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest("[data-slide]")) return;
    void close();
  };

  const current = items[index];
  const statusId = useId();

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      aria-describedby={statusId}
      className="fixed inset-0 z-[100] select-none [--focus:#ffffff]"
    >
      <p id={statusId} className="sr-only" aria-live="polite" aria-atomic="true">
        Image {index + 1} of {items.length}: {current.alt}
      </p>
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-2xl backdrop-saturate-150"
        style={{ opacity: backdropOpacity }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0 touch-none"
        style={{ x, y, scale, opacity: frameOpacity, transformOrigin: `${box.left + box.w / 2}px ${box.top + box.h / 2}px` }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onPointerDown={() => {
          panned.current = false;
        }}
        onClick={onStageClick}
      >
        <motion.div className="absolute inset-0" style={{ x: trackX }}>
          {items.map((item, i) =>
            Math.abs(i - index) <= 1 ? (
              <Slide
                key={item.key}
                item={item}
                thumb={getThumb(item.key)}
                box={fit(aspectOf(item, getThumb(item.key)), vp)}
                offset={i * pageW}
                active={i === index}
                radius={i === index ? radius : undefined}
                // Neighbours stay hidden while the active image morphs, or
                // they would slide into view as the stage scales down.
                opacity={i === index ? undefined : chrome}
              />
            ) : null,
          )}
        </motion.div>
      </motion.div>

      {/* Chrome */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: chrome }}>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-5">
          <span
            aria-hidden="true"
            className="glass glass-soft pointer-events-auto rounded-full px-3.5 py-1.5 text-sm font-medium tabular-nums text-white [--glass-bg:rgb(40_40_42/0.5)] [--glass-stroke:rgb(255_255_255/0.14)]"
          >
            {index + 1} / {items.length}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={srcOf(current.src)}
              target="_blank"
              rel="noopener noreferrer"
              className={chromeButton}
              aria-label="Open full-size image in a new tab"
            >
              <Expand size={17} />
            </a>
            <button ref={closeRef} type="button" onClick={() => void close()} className={chromeButton} aria-label="Close image viewer">
              <X size={19} />
            </button>
          </div>
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={cn(chromeButton, "absolute bottom-4 left-4 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2")}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === items.length - 1}
              className={cn(chromeButton, "absolute bottom-4 right-4 sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2")}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
            <Dots count={items.length} index={index} />
          </>
        )}
      </motion.div>
    </div>
  );
}

const chromeButton =
  "glass glass-soft pointer-events-auto grid h-11 w-11 place-items-center rounded-full text-white transition-[opacity,transform] duration-300 [--glass-bg:rgb(40_40_42/0.5)] [--glass-stroke:rgb(255_255_255/0.14)] hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-0";

function Slide({
  item,
  thumb,
  box,
  offset,
  active,
  radius,
  opacity,
}: {
  item: LightboxItem;
  thumb: HTMLElement | null;
  box: Box;
  offset: number;
  /** Off-screen neighbours are hidden from assistive tech. */
  active: boolean;
  radius?: MotionValue<number>;
  opacity?: MotionValue<number>;
}) {
  // Show the already-decoded thumbnail instantly, then fade in the sharp one.
  const [preview] = useState(() => thumb?.querySelector("img")?.currentSrc || "");
  const [sharp, setSharp] = useState(false);
  const srcSet = srcSetOf(item.src);

  return (
    <motion.div
      data-slide
      aria-hidden={active ? undefined : true}
      className="absolute overflow-hidden bg-white/5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]"
      style={{
        left: box.left + offset,
        top: box.top,
        width: box.w,
        height: box.h,
        borderRadius: radius ?? FRAME_RADIUS,
        opacity,
      }}
    >
      {preview && <img src={preview} alt="" draggable={false} className="absolute inset-0 h-full w-full" />}
      <img
        src={srcOf(item.src)}
        srcSet={srcSet}
        sizes={srcSet ? `${Math.ceil(box.w)}px` : undefined}
        alt={item.alt}
        draggable={false}
        onLoad={() => setSharp(true)}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-500",
          preview && !sharp ? "opacity-0" : "opacity-100",
        )}
      />
    </motion.div>
  );
}

function Dots({ count, index }: { count: number; index: number }) {
  // Like iOS page dots: only a window around the current one is shown.
  const max = 9;
  const startAt = Math.max(0, Math.min(count - max, index - Math.floor(max / 2)));
  const visible = Array.from({ length: Math.min(count, max) }, (_, i) => startAt + i);
  return (
    <div className="glass glass-soft pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-2.5 [--glass-bg:rgb(40_40_42/0.5)] [--glass-stroke:rgb(255_255_255/0.14)]">
      {visible.map((i) => (
        <motion.span
          key={i}
          layout
          className="block h-1.5 rounded-full bg-white"
          animate={{ width: i === index ? 18 : 6, opacity: i === index ? 1 : 0.4 }}
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
        />
      ))}
    </div>
  );
}
