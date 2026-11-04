import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { LOGO_BODY, LOGO_STRIPES, LOGO_TRIANGLE, LOGO_VIEWBOX } from "@/lib/logo";

/**
 * The manuxer mark, traced from assets/manuxer-logo.png into vectors so the
 * dark strokes follow the theme (currentColor) and the stripes can animate.
 */
export function Logo({ className }: { className?: string }) {
  const clipId = `logo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [[x0, y0], [x1], [ax, ay]] = LOGO_TRIANGLE;

  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
      className={cn("w-auto", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={`M${x0} ${y0}H${x1}L${ax} ${ay}Z`} />
        </clipPath>
      </defs>
      <path d={LOGO_BODY} fill="currentColor" />
      <g clipPath={`url(#${clipId})`}>
        {LOGO_STRIPES.map((s, i) => (
          <rect
            key={s.fill}
            className="logo-stripe"
            style={{ "--i": i } as CSSProperties}
            x="0"
            y={s.y}
            width={LOGO_VIEWBOX.w}
            height={s.h}
            fill={s.fill}
          />
        ))}
      </g>
    </svg>
  );
}
