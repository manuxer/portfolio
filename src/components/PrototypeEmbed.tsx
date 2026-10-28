import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * A self-contained HTML prototype from /public, framed like the case-study media.
 * It is same-origin, so the frame sizes itself to the prototype's content and
 * keeps the prototype's light/dark theme in step with the site's toggle.
 */
export function PrototypeEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  const [doc, setDoc] = useState<Document | null>(null);

  // Content height = the prototype's root element plus the body's vertical padding.
  useEffect(() => {
    const view = doc?.defaultView;
    const content = doc?.body.firstElementChild;
    if (!view || !content) return;
    const measure = () => {
      const pad = view.getComputedStyle(doc.body);
      const h = content.getBoundingClientRect().height + parseFloat(pad.paddingTop) + parseFloat(pad.paddingBottom);
      setHeight(Math.ceil(h));
    };
    const observer = new view.ResizeObserver(measure);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, [doc]);

  // Mirror the site's theme onto the prototype (it reads :root[data-theme]).
  useEffect(() => {
    if (!doc) return;
    const root = document.documentElement;
    const sync = () => {
      if (root.dataset.theme) doc.documentElement.dataset.theme = root.dataset.theme;
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    sync();
    return () => observer.disconnect();
  }, [doc]);

  const onLoad = () => {
    try {
      setDoc(ref.current?.contentDocument ?? null);
    } catch {
      setDoc(null); // cross-origin: keep the fallback aspect ratio
    }
  };

  return (
    <figure>
      <div className="media-frame" style={height ? { height } : { aspectRatio: "4 / 3" }}>
        <iframe
          ref={ref}
          src={src}
          title={title}
          loading="lazy"
          onLoad={onLoad}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
        <span className="t-body text-[0.95rem]">{title}</span>
        <a href={src} target="_blank" rel="noopener" className="link-chevron text-[0.95rem]">
          Open full screen <ArrowUpRight size={16} strokeWidth={2.2} />
        </a>
      </figcaption>
    </figure>
  );
}
