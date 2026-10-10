import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useSpecular } from "@/hooks/useSpecular";
import { cn } from "@/lib/cn";

/** Glass "‹ Back to Projects" pill that floats over hero media. */
export function BackPill({ className }: { className?: string }) {
  const onPointerMove = useSpecular<HTMLAnchorElement>();
  return (
    <Link
      to="/projects"
      viewTransition
      onPointerMove={onPointerMove}
      className={cn(
        "btn btn-sm glass glass-rim specular focus-ring-media group text-fg [--glass-bg:var(--glass-bg-strong)]",
        className,
      )}
    >
      <ChevronLeft size={17} strokeWidth={2.2} className="nudge-left -ml-1" />
      Back to Projects
    </Link>
  );
}
