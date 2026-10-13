import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { clients } from "@/data/clients";

// Every logo gets the same visual area, so a long wordmark (USPS.COM) and a
// compact one (Infosys) read at a similar weight.
const AREA = 2300; // px²

// One list must be wider than the carousel for the loop to stay seamless, so a
// short client list is repeated within it.
const loop = clients.length < 7 ? [...clients, ...clients] : clients;

function LogoList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="logo-marquee-list" aria-label={hidden ? undefined : "Companies I have worked with"} aria-hidden={hidden || undefined}>
      {loop.map((c, i) => {
        const height = Math.sqrt(AREA / c.ratio) * (c.scale ?? 1);
        return (
          <li key={i}>
            <span
              role={hidden ? undefined : "img"}
              aria-label={hidden ? undefined : c.name}
              aria-hidden={i >= clients.length || undefined}
              className="logo-marquee-item"
              style={{ "--logo": `url("${c.logo}")`, height, width: height * c.ratio } as CSSProperties}
            />
          </li>
        );
      })}
    </ul>
  );
}

/** Monochrome client logos drifting in a seamless loop. */
export function LogoCarousel({ className }: { className?: string }) {
  return (
    <div className={cn("logo-marquee", className)}>
      {/* Two identical lists: when the first has scrolled out, the second sits exactly where it began. */}
      <div className="logo-marquee-track">
        <LogoList />
        <LogoList hidden />
      </div>
    </div>
  );
}
