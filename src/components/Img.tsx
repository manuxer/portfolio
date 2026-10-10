import { useState, type CSSProperties, type Ref } from "react";
import { cn } from "@/lib/cn";
import { isPicture, srcOf, srcSetOf, type ImageSource } from "@/lib/image";

interface ImgProps {
  src: ImageSource;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold media: eager, high priority, no fade. */
  priority?: boolean;
  ref?: Ref<HTMLImageElement>;
}

export function Img({ src, alt, sizes, className, style, priority = false, ref }: ImgProps) {
  const [loaded, setLoaded] = useState(priority);

  return (
    <img
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
        if (typeof ref === "function") return ref(el);
        if (ref) ref.current = el;
      }}
      src={srcOf(src)}
      srcSet={srcSetOf(src)}
      sizes={srcSetOf(src) ? sizes : undefined}
      width={isPicture(src) ? src.img.w : undefined}
      height={isPicture(src) ? src.img.h : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      className={cn(!priority && "img-fade", loaded && "is-loaded", className)}
      style={style}
    />
  );
}
