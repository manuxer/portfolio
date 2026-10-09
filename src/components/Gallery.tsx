import { useMemo } from "react";
import { Maximize2 } from "lucide-react";
import { Img } from "@/components/Img";
import type { ImageSource } from "@/lib/image";
import { Reveal } from "@/components/Reveal";
import { useLightbox, type LightboxItem } from "@/components/lightbox-context";
import { cn } from "@/lib/cn";

interface GalleryProps {
  /** Unique per page — scopes thumbnail keys. */
  id: string;
  images: Array<{ src: ImageSource; alt: string }>;
  layout?: "stack" | "grid";
  /** Override the responsive `sizes` hint when the gallery sits in a narrower column. */
  sizes?: string;
  /** Artwork keeps its true colour (skips the dark-mode glare dim). */
  trueColor?: boolean;
  className?: string;
}

const STACK_SIZES = "(min-width: 1200px) 1120px, 94vw";
const GRID_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 46vw, 92vw";

export function Gallery({ id, images, layout = "stack", sizes, trueColor = false, className }: GalleryProps) {
  const { open, register, hiddenKey } = useLightbox();
  const items: LightboxItem[] = useMemo(
    () => images.map((img, i) => ({ key: `${id}-${i}`, src: img.src, alt: img.alt })),
    [id, images],
  );

  return (
    <div
      className={cn(
        layout === "stack" ? "space-y-6 md:space-y-10" : "columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5",
        className,
      )}
    >
      {items.map((item, i) => (
        <Reveal key={item.key} blur={false} y={layout === "stack" ? 48 : 28} className="break-inside-avoid">
          <button
            type="button"
            ref={(el) => {
              register(item.key, el);
              return () => register(item.key, null);
            }}
            onClick={() => open(items, i)}
            className="gallery-item group media-frame"
            style={{ visibility: hiddenKey === item.key ? "hidden" : undefined }}
            aria-haspopup="dialog"
            aria-label={`Enlarge image ${i + 1} of ${items.length}: ${item.alt}`}
          >
            <Img
              src={item.src}
              alt={item.alt}
              sizes={sizes ?? (layout === "stack" ? STACK_SIZES : GRID_SIZES)}
              className={cn("block h-auto w-full", trueColor && "true-color")}
            />
            <span
              aria-hidden="true"
              className="hover-chip glass glass-soft absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-fg [--glass-bg:var(--glass-bg-strong)]"
            >
              <Maximize2 size={16} strokeWidth={2} />
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  );
}
