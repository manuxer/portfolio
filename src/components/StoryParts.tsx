/**
 * Building blocks shared by the long-form case studies (ALICE's CaseStory, the AtoZ page):
 * section headings, labelled cards and images that open in the lightbox.
 */
import type { ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import { Img } from "@/components/Img";
import { useLightbox, type LightboxItem } from "@/components/lightbox-context";
import { Reveal } from "@/components/Reveal";
import type { Labelled } from "@/data/types";
import { useSpecular } from "@/hooks/useSpecular";
import { cn } from "@/lib/cn";

/** A section's heading: an optional eyebrow, the title and an optional lead paragraph. */
export function Heading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <Reveal>
          <p className="t-label">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn("t-title", eyebrow && "mt-3")}>{title}</h2>
      </Reveal>
      {children && (
        <Reveal delay={0.1}>
          <p className="t-lead mt-5">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

/** A titled block inside a section. */
export function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-16 md:mt-20">
      <Reveal>
        <h3 className="t-subtitle">{title}</h3>
      </Reveal>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function SummaryCard({ item, soft = false }: { item: Labelled; soft?: boolean }) {
  const onPointerMove = useSpecular<HTMLDivElement>();
  return (
    <div
      onPointerMove={onPointerMove}
      className={cn("glass glass-rim specular h-full rounded-[28px] p-7", soft && "glass-soft rounded-[26px]")}
    >
      <p className="t-label">{item.label}</p>
      <p className="mt-3 text-[1.06rem] font-medium leading-snug tracking-[-0.016em] text-fg">{item.text}</p>
    </div>
  );
}

/**
 * One image of a group that opens in the lightbox (which pages through the group). `plain`
 * drops the framed card, for images with their own shape, such as phone screens.
 */
export function ZoomImage({
  group,
  index,
  sizes,
  label = "image",
  plain = false,
  className,
  imgClassName,
}: {
  group: LightboxItem[];
  index: number;
  sizes: string;
  /** What the image is, for the button's name: "Expand screen 2 of 4: …". */
  label?: string;
  plain?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const { open, register, hiddenKey } = useLightbox();
  const item = group[index];
  return (
    <button
      type="button"
      ref={(el) => {
        register(item.key, el);
        return () => register(item.key, null);
      }}
      onClick={() => open(group, index)}
      className={cn("gallery-item group", plain ? "relative" : "media-frame", className)}
      style={{ visibility: hiddenKey === item.key ? "hidden" : undefined }}
      aria-label={`Expand ${label} ${index + 1} of ${group.length}: ${item.alt}`}
    >
      <Img src={item.src} alt={item.alt} sizes={sizes} className={cn("block h-auto w-full", imgClassName)} />
      <span className="hover-chip glass glass-soft absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-fg">
        <Maximize2 size={15} strokeWidth={2} />
      </span>
    </button>
  );
}
