import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

const stripes = [
  { y: 0, h: 67.5, fill: "#F2BC41" },
  { y: 67.5, h: 65, fill: "#DB5240" },
  { y: 132.5, h: 69, fill: "#56A65D" },
  { y: 201.5, h: 120, fill: "#5B81C1" },
];

/**
 * The manuxer mark, traced from assets/manuxer-logo.png into vectors so the
 * dark strokes follow the theme (currentColor) and the stripes can animate.
 */
export function Logo({ className }: { className?: string }) {
  const clipId = `logo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 464 417" className={cn("w-auto", className)} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d="M54 2H409.5L231.75 316Z" />
        </clipPath>
      </defs>
      <path d="M1 4 231.5 410 463 4V417H1Z" fill="currentColor" />
      <g clipPath={`url(#${clipId})`}>
        {stripes.map((s, i) => (
          <rect
            key={s.fill}
            className="logo-stripe"
            style={{ "--i": i } as CSSProperties}
            x="0"
            y={s.y}
            width="464"
            height={s.h}
            fill={s.fill}
          />
        ))}
      </g>
    </svg>
  );
}
